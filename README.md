# Student Management System

A complete full-stack Student Management application with Express backend, SQLite database, and HTML/CSS/JavaScript frontend. Now with complete user authentication!

## Features

### Core Features
- ✅ Add, edit, and delete student records
- ✅ View all students in a responsive table
- ✅ Search students by name, email, or phone
- ✅ Filter students by status (Active, Inactive, Graduated)
- ✅ Responsive design for mobile and desktop

### Authentication Features
- ✅ User registration with email validation
- ✅ Secure login system with password hashing
- ✅ Session management
- ✅ User dashboard with username display
- ✅ Logout functionality
- ✅ Protected routes (all student management pages require authentication)

## Technology Stack

**Backend:**
- Node.js with Express.js framework
- SQLite3 database
- Express-session for session management
- Bcryptjs for password hashing
- Body-parser and CORS for API requests

**Frontend:**
- HTML5 with semantic structure
- CSS3 with responsive design
- Vanilla JavaScript for interactivity
- RESTful API integration

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ikramtazdait/student-management.git
   cd student-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - You'll be redirected to the login page if not authenticated

## Usage

### First Time Users
1. Click "Register here" on the login page
2. Fill in your username, email, and password (minimum 6 characters)
3. Confirm your password and click "Register"
4. You'll be automatically logged in and redirected to the dashboard

### Existing Users
1. Enter your username and password
2. Click "Login"
3. You'll be redirected to the student management dashboard

### Managing Students
1. **Add a Student:** Fill in the form at the top and click "Add Student"
2. **Edit a Student:** Click the "Edit" button next to the student's name
3. **Delete a Student:** Click the "Delete" button and confirm
4. **Search Students:** Use the search box to filter by name, email, or phone
5. **Logout:** Click the "Logout" button in the top right corner

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check authentication status

### Student Management Endpoints (All require authentication)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student
- `POST /api/students` - Add a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### Students Table
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  enrollmentDate TEXT NOT NULL,
  gpa REAL DEFAULT 0,
  status TEXT DEFAULT 'active'
)
```

## Project Structure

```
student-management/
├── public/
│   ├── index.html          # Main dashboard page
│   ├── login.html          # Login/Register page
│   ├── script.js           # Main app JavaScript
│   ├── auth-script.js      # Authentication JavaScript
│   ├── styles.css          # Main app styles
│   └── auth-styles.css     # Authentication styles
├── database.js             # SQLite database configuration
├── server.js               # Express server setup
├── package.json            # Project dependencies
├── .gitignore              # Git ignore file
└── students.db             # SQLite database (created on first run)
```

## Security Features

- **Password Hashing:** All passwords are hashed using bcryptjs
- **Session Management:** Secure session management with express-session
- **Protected Routes:** All student management routes require authentication
- **Input Validation:** Server-side validation for all inputs
- **CORS:** Configured to prevent cross-origin issues

## Environment Configuration

The application uses default configuration. To customize:

**Session Settings (in server.js):**
- Change the `secret` key to a strong random string
- Adjust cookie expiration time as needed

## Troubleshooting

1. **Port Already in Use:**
   - Change the PORT in `server.js` to an available port

2. **Database Issues:**
   - Delete `students.db` and restart the server to reset the database

3. **Authentication Fails:**
   - Clear browser cookies and try logging in again
   - Ensure JavaScript is enabled in your browser

## Future Enhancements

- Email verification for registration
- Password reset functionality
- Two-factor authentication
- User roles and permissions (Admin, Teacher, Student)
- Student grades tracking
- Attendance management
- Parent/Guardian portal
- Export to CSV/PDF

## License

MIT License - See LICENSE file for details

## Author

Created as a complete full-stack student management solution with secure authentication.

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.
