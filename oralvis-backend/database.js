// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./oralvis.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the oralvis SQLite database.');
});

db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Technician', 'Dentist'))
    )`, (err) => {
        if (err) console.error("Error creating users table:", err.message);
    });

    // Create scans table
    db.run(`CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT NOT NULL,
        patientId TEXT NOT NULL,
        scanType TEXT NOT NULL,
        region TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Error creating scans table:", err.message);
    });
});

module.exports = db;