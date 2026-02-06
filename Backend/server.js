const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// =========================
// DATABASE CONNECTION
// =========================
const db = new sqlite3.Database("./queue.db", (err) => {
  if (err) {
    console.error("❌ Database connection failed", err);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// =========================
// USERS TABLE (Doctor/Admin)
// =========================
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'doctor',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("❌ Failed to create users table", err);
  } else {
    console.log("✅ Users table ready");
  }
});

// =========================
// PATIENTS TABLE (Queue + Medical)
// =========================
db.run(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    department TEXT,
    token TEXT,
    status TEXT
  )
`, (err) => {
  if (err) {
    console.error("❌ Failed to create patients table", err);
  } else {
    console.log("✅ Patients table ready");
  }
});

// =========================
// EXTEND PATIENTS TABLE
// (Safe ALTERs)
// =========================
db.run(`ALTER TABLE patients ADD COLUMN disease TEXT`, () => {});
db.run(`ALTER TABLE patients ADD COLUMN consulted_at DATETIME`, () => {});
db.run(`ALTER TABLE patients ADD COLUMN doctor_id INTEGER`, () => {});

// =========================
// EXISTING QUEUE LOGIC (UNCHANGED)
// =========================

// Generate token
function generateToken() {
  const letter = "A";
  const number = Math.floor(100 + Math.random() * 900);
  return `${letter}${number}`;
}

// Register patient
app.post("/register", (req, res) => {
  const { name, phone, department } = req.body;
  const token = generateToken();

  db.run(
    `INSERT INTO patients (name, phone, department, token, status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, phone, department, token, "waiting"],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to register patient" });
      }
      res.json({ token });
    }
  );
});

// Call next patient (still simple for now)
app.get("/next", (req, res) => {
  db.get(
    `SELECT * FROM patients WHERE status = 'waiting' ORDER BY id ASC LIMIT 1`,
    (err, row) => {
      if (!row) {
        return res.json({ message: "No patients waiting" });
      }

      db.run(
        `UPDATE patients SET status = 'done' WHERE id = ?`,
        [row.id]
      );

      res.json({ token: row.token, name: row.name });
    }
  );
});

// =========================
// SERVER START
// =========================
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});