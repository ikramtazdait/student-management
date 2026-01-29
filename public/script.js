let students = [];
let editingId = null;

const API_URL = 'http://localhost:3000/api/students';

// DOM Elements
const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const enrollmentDateInput = document.getElementById('enrollmentDate');
const gpaInput = document.getElementById('gpa');
const statusInput = document.getElementById('status');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const cancelBtn = document.getElementById('cancelBtn');

// Set today's date as default
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  enrollmentDateInput.value = today;
  loadStudents();
});

// Form submission
studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    address: addressInput.value.trim(),
    enrollmentDate: enrollmentDateInput.value,
    gpa: parseFloat(gpaInput.value) || 0,
    status: statusInput.value
  };

  try {
    if (editingId) {
      // Update student
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) throw new Error('Failed to update student');
      
      showAlert('Student updated successfully!', 'success');
      editingId = null;
      resetForm();
    } else {
      // Add new student
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) throw new Error('Failed to add student');
      
      showAlert('Student added successfully!', 'success');
      resetForm();
    }

    loadStudents();
  } catch (error) {
    showAlert(`Error: ${error.message}`, 'error');
    console.error('Error:', error);
  }
});

// Load all students
async function loadStudents() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch students');
    
    students = await response.json();
    displayStudents(students);
  } catch (error) {
    console.error('Error loading students:', error);
    showAlert('Failed to load students', 'error');
  }
}

// Display students in table
function displayStudents(studentList) {
  tableBody.innerHTML = '';

  if (studentList.length === 0) {
    tableBody.innerHTML = '<tr class="no-data"><td colspan="9">No students found. Add one to get started!</td></tr>';
    return;
  }

  studentList.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.phone || '-'}</td>
      <td>${student.address || '-'}</td>
      <td>${formatDate(student.enrollmentDate)}</td>
      <td>${student.gpa}</td>
      <td>
        <span class="status-badge status-${student.status}">
          ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
        </span>
      </td>
      <td>
        <div class="actions">
          <button class="btn btn-edit" onclick="editStudent(${student.id})">Edit</button>
          <button class="btn btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Format date to readable format
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Edit student
async function editStudent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch student');
    
    const student = await response.json();
    
    // Populate form with student data
    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone || '';
    addressInput.value = student.address || '';
    enrollmentDateInput.value = student.enrollmentDate;
    gpaInput.value = student.gpa || 0;
    statusInput.value = student.status;
    
    editingId = id;
    
    // Update button text and show cancel button
    studentForm.querySelector('button[type="submit"]').textContent = 'Update Student';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    studentForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showAlert(`Error: ${error.message}`, 'error');
    console.error('Error:', error);
  }
}

// Delete student
async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete student');
    
    showAlert('Student deleted successfully!', 'success');
    loadStudents();
  } catch (error) {
    showAlert(`Error: ${error.message}`, 'error');
    console.error('Error:', error);
  }
}

// Reset form
function resetForm() {
  studentForm.reset();
  editingId = null;
  const today = new Date().toISOString().split('T')[0];
  enrollmentDateInput.value = today;
  gpaInput.value = '0';
  statusInput.value = 'active';
  studentForm.querySelector('button[type="submit"]').textContent = 'Add Student';
  cancelBtn.style.display = 'none';
}

// Cancel button
cancelBtn.addEventListener('click', resetForm);

// Search functionality
searchInput.addEventListener('keyup', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm) ||
    (student.phone && student.phone.includes(searchTerm))
  );
  displayStudents(filteredStudents);
});

// Show alert message
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} show`;
  alert.textContent = message;
  
  const firstSection = document.querySelector('section');
  firstSection.insertBefore(alert, firstSection.firstChild);
  
  setTimeout(() => {
    alert.remove();
  }, 3000);
}
