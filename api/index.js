const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  registerUser,
  getUserByUsername,
  getUserByEmail,
  verifyPassword
} = require('../database');

const app = express();

// Middleware
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

// ===== AUTHENTICATION ROUTES =====

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  // Check if username exists
  getUserByUsername(username, (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (user) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    // Check if email exists
    getUserByEmail(email, (err, existingUser) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      // Register user
      registerUser(username, email, password, (err, userId) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Auto-login after registration
        req.session.userId = userId;
        req.session.username = username;
        res.status(201).json({ message: 'User registered successfully', userId });
      });
    });
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  // Get user
  getUserByUsername(username, (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ message: 'Login successful', userId: user.id, username: user.username });
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// ===== STUDENT MANAGEMENT ROUTES (Protected) =====

// Get all students
app.get('/api/students', isAuthenticated, (req, res) => {
  getAllStudents((err, students) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(students || []);
  });
});

// Get student by ID
app.get('/api/students/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  getStudentById(id, (err, student) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(student);
  });
});

// Add new student
app.post('/api/students', isAuthenticated, (req, res) => {
  const { name, email, phone, address, enrollmentDate, gpa, status } = req.body;

  // Validation
  if (!name || !email || !enrollmentDate) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const student = {
    name,
    email,
    phone: phone || '',
    address: address || '',
    enrollmentDate,
    gpa: gpa || 0,
    status: status || 'active'
  };

  addStudent(student, (err, studentId) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: studentId, message: 'Student added successfully' });
  });
});

// Update student
app.put('/api/students/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, enrollmentDate, gpa, status } = req.body;

  // Validation
  if (!name || !email || !enrollmentDate) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const student = {
    name,
    email,
    phone: phone || '',
    address: address || '',
    enrollmentDate,
    gpa: gpa || 0,
    status: status || 'active'
  };

  updateStudent(id, student, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student updated successfully' });
  });
});

// Delete student
app.delete('/api/students/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  deleteStudent(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = app;
