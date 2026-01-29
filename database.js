const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'students.db');

// Open database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table initialized');
    }
  });

  // Create students table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      address TEXT,
      enrollmentDate TEXT NOT NULL,
      gpa REAL DEFAULT 0,
      status TEXT DEFAULT 'active'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Students table initialized');
    }
  });
}

// Get all students
function getAllStudents(callback) {
  db.all('SELECT * FROM students ORDER BY id DESC', (err, rows) => {
    callback(err, rows);
  });
}

// Get student by ID
function getStudentById(id, callback) {
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    callback(err, row);
  });
}

// Add new student
function addStudent(student, callback) {
  db.run(
    `INSERT INTO students (name, email, phone, address, enrollmentDate, gpa, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [student.name, student.email, student.phone, student.address, student.enrollmentDate, student.gpa, student.status],
    function(err) {
      callback(err, this.lastID);
    }
  );
}

// Update student
function updateStudent(id, student, callback) {
  db.run(
    `UPDATE students SET name = ?, email = ?, phone = ?, address = ?, enrollmentDate = ?, gpa = ?, status = ? WHERE id = ?`,
    [student.name, student.email, student.phone, student.address, student.enrollmentDate, student.gpa, student.status, id],
    function(err) {
      callback(err);
    }
  );
}

// Delete student
function deleteStudent(id, callback) {
  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    callback(err);
  });
}

// Register user
function registerUser(username, email, password, callback) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashedPassword],
    function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, this.lastID);
      }
    }
  );
}

// Get user by username
function getUserByUsername(username, callback) {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    callback(err, row);
  });
}

// Get user by email
function getUserByEmail(email, callback) {
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    callback(err, row);
  });
}

// Verify user password
function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  db,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  registerUser,
  getUserByUsername,
  getUserByEmail,
  verifyPassword
};
