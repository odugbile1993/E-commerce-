const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config(); // Load environment variables

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MySQL database connection setup using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploaded files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware to check JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        // Verify the token using your JWT secret from .env
        const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'default_secret');
        req.user = decoded; // Add user data to the request object
        next(); // Move to the next function (the dashboard)
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

// Registration route
app.post('/register', upload.fields([{ name: 'passportPhoto', maxCount: 1 }, { name: 'itemImages', maxCount: 10 }]), async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    // Handle the uploaded files if necessary
    const passportPhoto = req.files['passportPhoto'] ? req.files['passportPhoto'][0].path : null;
    const itemImages = req.files['itemImages'] ? req.files['itemImages'].map(file => file.path) : [];

    // Check if the email already exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        db.query('INSERT INTO users (name, email, password, phone, role, passport_photo, item_images) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [name, email, hashedPassword, phone, role, passportPhoto, JSON.stringify(itemImages)], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create user' });
            }
            res.status(201).json({ message: 'User created successfully' });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token using the secret from .env
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SESSION_SECRET || 'default_secret', { expiresIn: '1h' });

        res.json({ token });
    });
});

// Dashboard route (protected)
app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to your dashboard!', user: req.user });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
