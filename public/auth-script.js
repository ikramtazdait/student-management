const API_URL = 'http://localhost:3000/api/auth';

// DOM Elements
const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const loginFormContainer = document.getElementById('loginForm');
const registerFormContainer = document.getElementById('registerForm');
const alertMessage = document.getElementById('alertMessage');

// Toggle between login and register forms
function toggleForm(event) {
  event.preventDefault();
  loginFormContainer.classList.toggle('active');
  registerFormContainer.classList.toggle('active');
  alertMessage.style.display = 'none';
  loginForm.reset();
  registerForm.reset();
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.error || 'Login failed', 'error');
      return;
    }

    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    showAlert(`Error: ${error.message}`, 'error');
    console.error('Error:', error);
  }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, confirmPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.error || 'Registration failed', 'error');
      return;
    }

    showAlert('Registration successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    showAlert(`Error: ${error.message}`, 'error');
    console.error('Error:', error);
  }
});

// Show alert message
function showAlert(message, type) {
  alertMessage.textContent = message;
  alertMessage.className = `alert ${type}`;
  alertMessage.style.display = 'block';
}
