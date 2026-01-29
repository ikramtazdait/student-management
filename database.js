const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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

module.exports = {
  db,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
