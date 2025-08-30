const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require("dotenv").config();

const db = require('./database');
const authMiddleware = require('./authMiddleware');

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- API ROUTES ---

app.get("/", (req, res) => {
    res.send("OralVis Healthcare Backend is running!");
});

// User Registration
app.post('/api/register', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Please provide email, password, and role." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    db.run(sql, [email, hashedPassword, role], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error registering user.", error: err.message });
        }
        res.status(201).json({ message: `User created with ID: ${this.lastID}` });
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ message: "Server error." });
        if (!user) return res.status(400).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    });
});

// Upload Scan Endpoint
app.post('/api/upload', authMiddleware, upload.single('scanImage'), async (req, res) => {
    if (req.user.role !== 'Technician') {
        return res.status(403).json({ message: 'Forbidden: Only Technicians can upload.' });
    }
    // Read the timestamp sent from the frontend
    const { patientName, patientId, scanType, region, uploadDate } = req.body; 
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });

    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary upload failed.', error });
        
        // Save to database with the timestamp provided by the client
        const sql = `INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [patientName, patientId, scanType, region, result.secure_url, uploadDate], function(err) {
            if (err) return res.status(500).json({ message: 'Database insert failed.', error: err.message });
            res.status(201).json({ message: 'Scan uploaded successfully!', url: result.secure_url });
        });
    }).end(req.file.buffer);
});

// Get All Scans
app.get('/api/scans', authMiddleware, (req, res) => {
    if (req.user.role !== 'Dentist' && req.user.role !== 'Technician') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const sql = "SELECT * FROM scans ORDER BY uploadDate DESC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error fetching scans.', error: err.message });
        res.json(rows);
    });
});

// --- CORRECTED ROUTE ORDER ---

// Clear all scans endpoint (Technician or Dentist)
// This more specific route must come BEFORE the general '/:id' route.
app.delete('/api/scans/all', authMiddleware, (req, res) => {
    console.log("Request received to clear all scans."); // DEBUG LOG

    if (req.user.role !== 'Dentist' && req.user.role !== 'Technician') {
        console.log("Authorization failed for clear all scans."); // DEBUG LOG
        return res.status(403).json({ message: 'Forbidden: You do not have permission to clear all scans.' });
    }

    const sql = "DELETE FROM scans";

    db.run(sql, [], function(err) {
        if (err) {
            console.error("Error clearing scans from database:", err); // DEBUG LOG
            return res.status(500).json({ message: 'Error clearing scans.', error: err.message });
        }
        console.log("All scans cleared successfully. Rows affected:", this.changes); // DEBUG LOG
        res.json({ message: 'All scans cleared successfully.' });
    });
});

// Delete a single scan
app.delete('/api/scans/:id', authMiddleware, (req, res) => {
    if (req.user.role !== 'Dentist' && req.user.role !== 'Technician') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const id = req.params.id;
    const sql = "DELETE FROM scans WHERE id = ?";
    db.run(sql, id, function(err) {
        if (err) return res.status(500).json({ message: 'Error deleting scan.', error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Scan not found.' });
        res.json({ message: 'Scan deleted successfully.' });
    });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

