# Quick Start Guide

## Local Development (Windows/Mac/Linux)

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ikramtazdait/student-management.git
   cd student-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - You'll be redirected to the login page

### Create Your First Account

1. Click "Register here" on the login page
2. Enter:
   - **Username**: admin
   - **Email**: admin@example.com
   - **Password**: password123 (minimum 6 characters)
   - **Confirm Password**: password123
3. Click "Register"
4. You'll be automatically logged in!

### Test the Application

1. **Add a Student**
   - Fill in the form with student details
   - Click "Add Student"

2. **View Students**
   - All students appear in the table below

3. **Search Students**
   - Use the search box to find students by name, email, or phone

4. **Edit a Student**
   - Click "Edit" next to a student
   - Modify the information
   - Click "Update Student"

5. **Delete a Student**
   - Click "Delete" next to a student
   - Confirm the deletion

6. **Logout**
   - Click "Logout" in the top right corner

## Deployment on Vercel

### Quick Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add these variables:
     - `SESSION_SECRET`: Generate a random string (e.g., `openssl rand -hex 32`)
     - `FRONTEND_URL`: Your Vercel URL (e.g., `https://student-management.vercel.app`)
     - `NODE_ENV`: `production`

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment
   - Your app will be live!

### Access Your Deployed App

Once deployed, your app will be available at:
```
https://student-management.vercel.app
```
(or your custom domain)

## Project Features

✅ **User Authentication**
- Secure registration with email validation
- Password hashing with bcryptjs
- Session-based login
- Auto-logout after 24 hours

✅ **Student Management**
- Add new students
- View all students in a responsive table
- Edit student information
- Delete students
- Search by name, email, or phone
- Filter by status (Active, Inactive, Graduated)

✅ **Responsive Design**
- Mobile-friendly interface
- Works on all devices
- Modern gradient design

✅ **Serverless Deployment**
- Ready for Vercel deployment
- Automatic scaling
- Zero server maintenance

## Project Structure

```
student-management/
├── api/                     # Vercel serverless functions
│   └── index.js            # Main API handler
├── public/                  # Frontend files
│   ├── index.html          # Main dashboard
│   ├── login.html          # Login/Register
│   ├── script.js           # Dashboard logic
│   ├── auth-script.js      # Auth logic
│   ├── styles.css          # Dashboard styles
│   └── auth-styles.css     # Auth styles
├── database.js             # SQLite configuration
├── server.js               # Express app
├── package.json            # Dependencies
├── vercel.json             # Vercel config
├── .vercelignore           # Vercel ignore file
└── VERCEL_DEPLOYMENT.md    # Detailed deployment guide
```

## Troubleshooting

### Port Already in Use

If you get an "EADDRINUSE" error:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Then restart:
```bash
npm start
```

### Can't Login

- Make sure you've registered first
- Check username and password are correct
- Clear browser cookies and try again

### Database Issues

To reset the database:
1. Stop the server (press Ctrl+C)
2. Delete `students.db` file
3. Restart the server (`npm start`)

### Vercel Deployment Issues

See **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** for detailed troubleshooting

## Database

The application uses SQLite for local development. The database file (`students.db`) is automatically created on first run.

**Tables:**
- **users**: Stores user accounts with hashed passwords
- **students**: Stores student information

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check authentication status

### Students (All require authentication)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get specific student
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Security

✅ Passwords hashed with bcryptjs (10 salt rounds)
✅ Session-based authentication
✅ Protected API routes
✅ Input validation on frontend and backend
✅ CORS properly configured
✅ HTTPS on Vercel (automatic)

## Support

For issues or questions:
1. Check [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
2. Check [README.md](README.md)
3. Review error messages carefully
4. Check browser console (F12) for errors

## Next Steps

After deploying, you can:
- Add more fields to student records
- Implement user roles (admin, teacher, student)
- Add grade tracking
- Create attendance management
- Export data to CSV/PDF
- Add email notifications

## License

MIT License - See LICENSE file for details

Happy managing! 🎓
