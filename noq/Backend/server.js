const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SQLite DB
const db = new sqlite3.Database("./queue.db");

// Create table
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
      if (err) return res.status(500).json(err);
      res.json({ token });
    }
  );
});

// Call next patient
app.get("/next", (req, res) => {
  db.get(
    `SELECT * FROM patients WHERE status = 'waiting' ORDER BY id ASC LIMIT 1`,
    (err, row) => {
      if (!row) return res.json({ message: "No patients waiting" });

      db.run(
        `UPDATE patients SET status = 'done' WHERE id = ?`,
        [row.id]
      );

      res.json({ token: row.token, name: row.name });
    }
  );
});

// Start server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
