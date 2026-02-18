const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// =========================
// CONFIG
// =========================
const JWT_SECRET = process.env.JWT_SECRET || "noq_super_secret";

// =========================
// EMAIL CONFIG (NODEMAILER)
// =========================
let transporter;

async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📨 Ethereal Email Configured:", testAccount.user);
  } catch (e) {
    console.error("Failed to create test account", e);
  }
}
createTestAccount();

// =========================
// DATABASE
// =========================
const db = new sqlite3.Database("./queue.db", (err) => {
  if (err) console.error("❌ DB error", err);
  else console.log("✅ SQLite connected");
});

// =========================
// TABLES & MIGRATIONS
// =========================
db.serialize(() => {
  // USERS (Doctor/Admin)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'doctor',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // PATIENTS
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT,
      department TEXT,
      token TEXT,
      status TEXT
    )
  `);

  // EXTEND PATIENTS (safe for SQLite MVP)
  db.run(`ALTER TABLE patients ADD COLUMN disease TEXT`, () => {});
  db.run(`ALTER TABLE patients ADD COLUMN medicine TEXT`, () => {}); 
  db.run(`ALTER TABLE patients ADD COLUMN remarks TEXT`, () => {});  
  db.run(`ALTER TABLE patients ADD COLUMN consulted_at DATETIME`, () => {});
  db.run(`ALTER TABLE patients ADD COLUMN doctor_id INTEGER`, () => {});
  db.run(`ALTER TABLE patients ADD COLUMN email TEXT`, () => {}); 
  db.run(`ALTER TABLE patients ADD COLUMN called_at DATETIME`, () => {});

  // RECOVER STUCK CONSULTATIONS (PERMANENT FIX)
  db.run(`
    UPDATE patients
    SET status = 'waiting',
      doctor_id = NULL
    WHERE status = 'in_consultation'
  `, (err) => {
      if (err && err.code !== 'SQLITE_ERROR') console.error(err); 
  });
});

// =========================
// ZOD SCHEMAS (MINIMAL)
// =========================
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const patientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  department: z.string().min(2),
});

// =========================
// JWT MIDDLEWARE
// =========================
function authenticateDoctor(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.doctor = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// =========================
// AUTH ROUTES
// =========================
// SIGNUP
app.post("/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const { name, email, password } = parsed.data;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (_, user) => {
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashed],
      () => res.json({ message: "Signup successful" })
    );
  });
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const { email, password } = parsed.data;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (_, user) => {
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email }, // Added name/email to token
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  });
});

// =========================
// QUEUE LOGIC
// =========================
function generateToken() {
  return `A${Math.floor(100 + Math.random() * 900)}`;
}

// REGISTER PATIENT (PUBLIC)
app.post("/register", (req, res) => {
  const parsed = patientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const { name, phone, email, department } = parsed.data;
  const token = generateToken();

  db.run(
    `INSERT INTO patients (name, phone, email, department, token, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, phone, email || null, department, token, "waiting"],
    function (err) {
      if (err) {
        console.error("❌ Registration INSERT Error:", err.message);
        return res.status(500).json({ error: "Failed to save patient" });
      }
      res.json({ token });
    }
  );
});

// =========================
// DOCTOR ACTIONS
// =========================

// GET WAITING PATIENTS
app.get("/doctor/waiting-patients", authenticateDoctor, (req, res) => {
  db.all(
    `SELECT id, name, token, department, phone
     FROM patients
     WHERE status = 'waiting'
     ORDER BY id ASC`,
    (err, rows) => {
       if (err) {
         console.error(err);
         return res.status(500).json({ error: "Database error" });
       }
       res.json(rows);
    }
  );
});

// CALL NEXT PATIENT
app.get("/next", authenticateDoctor, (req, res) => {
  const doctorId = req.doctor.id;

  db.serialize(() => {
    db.get(
      `SELECT * FROM patients
       WHERE status = 'waiting'
        AND doctor_id IS NULL
       ORDER BY id ASC
       LIMIT 1`,
      (err, patient) => {
        if (!patient) {
          return res.json({ message: "No patients waiting" });
        }

        const now = new Date().toISOString();
        db.run(
          `UPDATE patients
           SET status = 'in_consultation',
               doctor_id = ?,
               called_at = ?
           WHERE id = ?`,
          [doctorId, now, patient.id],
          function () {
            res.json({
              patient_id: patient.id,
              token: patient.token,
              name: patient.name,
              phone: patient.phone,
              email: patient.email, // Added email
              department: patient.department,
            });
          }
        );
      }
    );
  });
});

// GET ACTIVE PATIENT (RECOVERY)
app.get("/doctor/active-patient", authenticateDoctor, (req, res) => {
  const doctorId = req.doctor.id;

  db.get(
    `SELECT * FROM patients
     WHERE status = 'in_consultation'
       AND doctor_id = ?`,
    [doctorId],
    (err, patient) => {
      if (!patient) return res.json(null);
      res.json({
        patient_id: patient.id,
        token: patient.token,
        name: patient.name,
        phone: patient.phone,
        email: patient.email, // Added email
        department: patient.department,
      });
    }
  );
});

// SAVE CONSULTATION
app.post("/consult", authenticateDoctor, (req, res) => {
  const { patient_id, disease, medicine, remarks, status } = req.body; 
  const doctorId = req.doctor.id;

  // If skipping, we might not have disease, so we relax validation if status is skipped
  if (!patient_id) {
    return res.status(400).json({ message: "Patient ID required" });
  }

  const finalStatus = status === 'skipped' ? 'skipped' : 'done';

  db.run(
    `UPDATE patients
     SET disease = ?,
         medicine = ?,
         remarks = ?,
         consulted_at = CURRENT_TIMESTAMP,
         status = ?
     WHERE id = ? AND doctor_id = ?`,
    [disease, medicine || "", remarks || "", finalStatus, patient_id, doctorId],
    function () {
      if (this.changes === 0) {
        return res
          .status(403)
          .json({ message: "Patient not assigned to this doctor" });
      }

      res.json({ message: "Consultation saved" });
    }
  );
});

// DELETE PATIENT
app.delete("/patients/:id", authenticateDoctor, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM patients WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Patient deleted" });
  });
});

// NOTIFY PATIENT (EMAIL)
app.post("/notify", authenticateDoctor, async (req, res) => {
  const { email, name, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Email and message required" });
  }

  if (!transporter) {
     return res.status(503).json({ message: "Email service not ready" });
  }

  try {
    const info = await transporter.sendMail({
      from: '"CareTrio Clinic" <clinic@caretrio.com>',
      to: email,
      subject: "Your Consultation Report - CareTrio",
      text: `Dear ${name},\n\n${message}\n\nStay Healthy,\nCareTrio Team`,
      html: `<p>Dear <b>${name}</b>,</p><p>${message.replace(/\n/g, "<br>")}</p><p>Stay Healthy,<br><b>CareTrio Team</b></p>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({ message: "Email sent successfully", preview: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// PUBLIC QUEUE STATUS
app.get("/queue-status", (req, res) => {
  const response = {
    current: null,
    upcoming: []
  };

  db.serialize(() => {
    // Get latest active patient (across all doctors)
    db.get(
      `SELECT token, doctor_id FROM patients 
       WHERE status = 'in_consultation' 
       ORDER BY called_at DESC LIMIT 1`, 
      (err, row) => {
        if (row) response.current = row;
        
        // Get next 5 waiting
        db.all(
          `SELECT token FROM patients WHERE status = 'waiting' ORDER BY id ASC LIMIT 5`,
          (err, rows) => {
             response.upcoming = rows || [];
             res.json(response);
          }
        );
      }
    );
  });
});

// GET TODAY'S PATIENTS
app.get("/admin/today-patients", authenticateDoctor, (req, res) => {
  const doctorId = req.doctor.id;

  db.all(
    `SELECT id, name, phone, email, department, disease, consulted_at
     FROM patients
     WHERE status = 'done' or status = 'skipped'
       AND doctor_id = ?
       AND DATE(consulted_at) = DATE('now')
     ORDER BY consulted_at DESC`,
    [doctorId],
    (_, rows) => res.json(rows)
  );
});

// =========================
// SERVER START
// =========================
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});