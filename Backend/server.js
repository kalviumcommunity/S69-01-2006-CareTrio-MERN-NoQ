const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// =========================
// CONFIG
// =========================
const JWT_SECRET = process.env.JWT_SECRET || "noq_super_secret";

// =========================
// DATABASE
// =========================
const db = new sqlite3.Database("./queue.db", (err) => {
  if (err) console.error("❌ DB error", err);
  else console.log("✅ SQLite connected");
});

// =========================
// TABLES
// =========================

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
    department TEXT,
    token TEXT,
    status TEXT
  )
`);

// EXTEND PATIENTS (safe for SQLite MVP)
db.run(`ALTER TABLE patients ADD COLUMN disease TEXT`, () => {});
db.run(`ALTER TABLE patients ADD COLUMN consulted_at DATETIME`, () => {});
db.run(`ALTER TABLE patients ADD COLUMN doctor_id INTEGER`, () => {});

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
    req.doctor = decoded; // { id, role }
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
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

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
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (_, user) => {
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

// =========================
// QUEUE LOGIC
// =========================

// Generate token
function generateToken() {
  return `A${Math.floor(100 + Math.random() * 900)}`;
}

// REGISTER PATIENT (PUBLIC)
app.post("/register", (req, res) => {
  const { name, phone, department } = req.body;
  const token = generateToken();

  db.run(
    `INSERT INTO patients (name, phone, department, token, status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, phone, department, token, "waiting"],
    () => res.json({ token })
  );
});

// =========================
// CALL NEXT PATIENT (PROTECTED)
// =========================
app.get("/next", authenticateDoctor, (req, res) => {
  const doctorId = req.doctor.id;

  db.get(
    `SELECT * FROM patients WHERE status = 'waiting' ORDER BY id ASC LIMIT 1`,
    (_, patient) => {
      if (!patient)
        return res.json({ message: "No patients waiting" });

      db.run(
        `UPDATE patients 
         SET status = 'in_consultation', doctor_id = ?
         WHERE id = ?`,
        [doctorId, patient.id]
      );

      res.json({
        patient_id: patient.id,
        token: patient.token,
        name: patient.name,
      });
    }
  );
});

// =========================
// SAVE CONSULTATION (PHASE 4)
// =========================
app.post("/consult", authenticateDoctor, (req, res) => {
  const { patient_id, disease } = req.body;
  const doctorId = req.doctor.id;

  if (!patient_id || !disease)
    return res.status(400).json({ message: "Patient ID and disease required" });

  db.run(
    `UPDATE patients
     SET disease = ?, 
         consulted_at = CURRENT_TIMESTAMP,
         status = 'done'
     WHERE id = ? AND doctor_id = ?`,
    [disease, patient_id, doctorId],
    function () {
      res.json({ message: "Consultation saved" });
    }
  );
});

// =========================
// GET TODAY'S PATIENTS (ADMIN)
// =========================
app.get("/admin/today-patients", authenticateDoctor, (req, res) => {
  const doctorId = req.doctor.id;

  db.all(
    `SELECT name, phone, department, disease, consulted_at
     FROM patients
     WHERE status = 'done'
       AND doctor_id = ?
       AND DATE(consulted_at) = DATE('now')`,
    [doctorId],
    (_, rows) => {
      res.json(rows);
    }
  );
});

// =========================
// SERVER START
// =========================
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});