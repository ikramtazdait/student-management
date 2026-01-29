# Vercel Deployment Guide

This Student Management System is fully configured for deployment on Vercel with serverless functions.

## Pre-Deployment Setup

### 1. Install Vercel CLI (Optional but recommended)
```bash
npm install -g vercel
```

### 2. Set Environment Variables

Before deploying, set these environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Description |
|---|---|---|
| `SESSION_SECRET` | Generate a random string | Secret key for session encryption |
| `FRONTEND_URL` | Your Vercel domain | e.g., `https://your-app.vercel.app` |
| `NODE_ENV` | `production` | Environment mode |

### How to Generate a SESSION_SECRET

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `SESSION_SECRET`.

## Deployment Steps

### Option 1: Using Vercel Dashboard (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository (student-management)
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Set Environment Variables**
   - In the Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add `SESSION_SECRET` with a secure random value
   - Add `FRONTEND_URL` with your Vercel domain (e.g., `https://student-management.vercel.app`)

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete (usually 1-2 minutes)

### Option 2: Using Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Confirm project settings
   - Set environment variables when prompted
   - Wait for deployment

## Project Structure for Vercel

```
student-management/
├── api/
│   └── index.js              # Serverless function handling all API routes
├── public/
│   ├── index.html            # Main dashboard
│   ├── login.html            # Login/Register page
│   ├── script.js
│   ├── auth-script.js
│   ├── styles.css
│   └── auth-styles.css
├── database.js               # Database configuration
├── server.js                 # Express app (for both local and Vercel)
├── package.json
├── vercel.json              # Vercel configuration (important!)
├── .vercelignore            # Files to ignore during deployment
├── .env.example             # Example environment variables
└── README.md
```

## How It Works

### Serverless Function Routing

Vercel uses the `vercel.json` configuration to route requests:

- **`/api/*`** routes → Serverless function (`api/index.js`)
- **Static files** → Served directly from `public/` folder
- **Root path** → Serves `public/index.html`

### API Endpoints

All API endpoints work the same as local development:

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check auth status

**Student Management (Protected):**
- `GET /api/students` - Get all students
- `POST /api/students` - Add student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Local Development

You can still run the application locally for development:

```bash
npm start
```

The app will:
- Use local SQLite database (`students.db`)
- Run on `http://localhost:3000`
- Use the Express server from `server.js`

## Database Persistence

**Important:** Vercel's ephemeral filesystem means the SQLite database is reset on each deployment. For production use, consider:

### Option 1: Use a Cloud Database
Replace SQLite with:
- **PostgreSQL** (recommended)
- **MongoDB**
- **MySQL**
- **Firebase**

### Option 2: Add to Deployment

1. Deploy once to create the database
2. Your data persists during the deployment lifecycle
3. Redeploys will reset the database (add migration scripts if needed)

## Troubleshooting

### "EADDRINUSE" Error When Starting Locally

Port 3000 is in use. Kill the process:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Session Issues After Deployment

Make sure you've set the `SESSION_SECRET` environment variable in Vercel. Without it, sessions won't work correctly.

### CORS Issues

If you get CORS errors:
1. Check that `FRONTEND_URL` is set correctly in Vercel environment variables
2. Ensure the URL matches your actual Vercel domain
3. Update `FRONTEND_URL` if you change your domain

### Database Not Loading Data

For Vercel production:
- The SQLite database is ephemeral (resets on deploy)
- Consider migrating to PostgreSQL or MongoDB
- Or add initialization scripts to populate data automatically

## Performance Optimization

The app is already optimized for Vercel:

✅ **Serverless functions** - No always-on servers
✅ **Static file serving** - Direct from Vercel CDN
✅ **Efficient routing** - Smart request distribution
✅ **Auto-scaling** - Handles traffic spikes automatically

## Custom Domain

To use a custom domain:

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records according to Vercel's instructions
4. Update `FRONTEND_URL` in environment variables with your custom domain

## Security Best Practices

1. **Session Secret**: Use a strong, random string (32+ characters)
2. **HTTPS**: Vercel provides HTTPS by default
3. **Environment Variables**: Never commit sensitive data
4. **Password Hashing**: Already implemented with bcryptjs
5. **CORS**: Properly configured for Vercel domains

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Guide](https://vercel.com/docs/runtimes/nodejs)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Summary

Your application is now ready for production deployment on Vercel! 

Simply:
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

The serverless architecture will automatically scale based on demand and requires zero server maintenance.
