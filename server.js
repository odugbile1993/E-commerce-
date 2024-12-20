const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Database setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change to your MySQL credentials
  password: '',
  database: 'marketplace'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', require('./routes/api'));

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
