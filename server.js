const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
} = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes for API

// Get all students
app.get('/api/students', (req, res) => {
  getAllStudents((err, students) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(students || []);
  });
});

// Get student by ID
app.get('/api/students/:id', (req, res) => {
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
app.post('/api/students', (req, res) => {
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
app.put('/api/students/:id', (req, res) => {
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
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  deleteStudent(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
