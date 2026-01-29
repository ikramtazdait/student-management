# Step-by-Step Vercel Deployment Guide

This guide walks you through deploying your Student Management System to Vercel.

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free at vercel.com)
- Ability to manage environment variables

## Step-by-Step Instructions

### Step 1: Verify Code is on GitHub

Ensure all your code is pushed to GitHub:

```bash
git status  # Should be clean
git log --oneline  # Should show recent commits
```

If not pushed, run:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Go to Vercel

1. Open [https://vercel.com](https://vercel.com) in your browser
2. Click **Sign Up** (if you don't have an account) or **Sign In**
3. Choose to sign up with **GitHub** (recommended)

### Step 3: Create New Project

1. Click **New Project** (or **Add New** → **Project**)
2. You'll see a list of your GitHub repositories
3. Look for **student-management**
4. Click **Import** (or **Select** button)

### Step 4: Import Settings

Vercel will automatically detect:
- **Framework Preset**: Node.js
- **Root Directory**: `.`
- **Build Command**: (leave default)
- **Environment Variables**: Will add these next

This is correct! Click **Continue** or **Next**.

### Step 5: Configure Environment Variables

**Important**: Set these before deployment!

1. Expand the **Environment Variables** section
2. Add these three variables:

#### Variable 1: SESSION_SECRET
- **Name**: `SESSION_SECRET`
- **Value**: Generate a random string using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Copy the entire output (64 character hex string)
- Paste it as the value

#### Variable 2: FRONTEND_URL
- **Name**: `FRONTEND_URL`
- **Value**: Keep it as `.vercel.app` will auto-fill, or use:
  ```
  https://student-management.vercel.app
  ```

#### Variable 3: NODE_ENV
- **Name**: `NODE_ENV`
- **Value**: `production`

Your screen should show:
```
✓ SESSION_SECRET = [your-random-hex-string]
✓ FRONTEND_URL = https://student-management.vercel.app
✓ NODE_ENV = production
```

Click **Add** for each variable to confirm.

### Step 6: Deploy

1. Click the **Deploy** button (big blue button)
2. Wait for the deployment to complete
   - You'll see a spinning indicator
   - Status messages like "Running build scripts"
   - Takes about 1-2 minutes

3. When complete, you'll see:
   ```
   ✓ Deployment complete
   https://student-management.vercel.app
   ```

### Step 7: Test Your App

1. Click the link provided (or copy the URL)
2. Your app should load at: `https://student-management.vercel.app`
3. You'll see the login page
4. Try registering a new account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
5. Add a test student to verify everything works

## After Deployment

### Your App is Live!

Your app is now running on Vercel's servers worldwide:
- **URL**: `https://student-management.vercel.app`
- **Domain**: Vercel-provided subdomain
- **Updates**: Auto-deploy whenever you push to GitHub

### Future Deployments

Every time you update code:

```bash
git add .
git commit -m "Your message"
git push origin main
```

Vercel will **automatically**:
1. Detect the push
2. Build your app
3. Run tests (if configured)
4. Deploy to production
5. Update your live site

No manual deployment needed!

## Custom Domain (Optional)

To use your own domain (e.g., `mystudents.com`):

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Enter your custom domain
4. Follow DNS setup instructions
5. Update `FRONTEND_URL` environment variable
6. Wait for DNS propagation (5-48 hours)

## Environment Variables Reference

### What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| `SESSION_SECRET` | Encrypts user sessions | `a1b2c3d4...` (32 bytes hex) |
| `FRONTEND_URL` | CORS origin, tells backend where requests come from | `https://app.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |

### Changing Environment Variables Later

If you need to change variables after deployment:

1. Go to your Vercel project dashboard
2. Click **Settings**
3. Click **Environment Variables**
4. Edit or add variables
5. Changes take effect on next deployment
   - Redeploy manually: Click **Deployments** → **Redeploy**
   - Or push code changes to auto-redeploy

## Troubleshooting

### "Deployment Failed"

**Check these:**
1. Are all files committed? `git status`
2. Are there syntax errors? Check `npm start` locally
3. Is `vercel.json` valid JSON?
4. Check the deployment logs in Vercel dashboard

### "Can't Access the App"

1. Try clearing browser cache (Ctrl+Shift+Delete)
2. Try in an incognito/private window
3. Check that deployment says "Ready"
4. Wait a few minutes for CDN caching

### "Login Not Working"

**Most common cause**: Missing or wrong `SESSION_SECRET`

1. Go to Vercel dashboard → **Settings** → **Environment Variables**
2. Check that `SESSION_SECRET` is set (should be 64 hex characters)
3. Manually redeploy:
   - Click **Deployments**
   - Find latest deployment
   - Click **...** (three dots)
   - Click **Redeploy**

### "Database Errors"

SQLite is ephemeral on Vercel (data doesn't persist between deployments).

**Temporary**: Data persists during current deployment lifetime
**Long-term**: Upgrade to PostgreSQL or MongoDB

Don't worry for now - it works great for testing!

### "CORS/API Errors"

**Check**:
1. `FRONTEND_URL` matches your actual domain
2. API is being called correctly (check browser DevTools)
3. Session is being created (check cookies)

**Fix**:
1. Update `FRONTEND_URL` if you changed your domain
2. Manually redeploy to apply changes
3. Clear browser cookies

## Vercel Dashboard Overview

### Deployments Tab
- See all previous deployments
- Roll back to previous versions
- View build logs
- Redeploy specific versions

### Settings Tab
- **General**: Project name, Git settings
- **Environment Variables**: Add/edit secrets
- **Domains**: Add custom domains
- **Integrations**: Connect external services
- **Monitoring**: View analytics and errors

### Analytics Tab
- Page views and performance
- Error rates
- Response times
- Visitor analytics

## Key Points to Remember

✅ Environment variables are **not** in git (secure!)
✅ Deployments are **automatic** on push
✅ Your app **scales infinitely** automatically
✅ You only **pay for what you use** (generous free tier)
✅ Rollbacks are **instant** if needed
✅ CDN distribution is **worldwide**

## Costs

**For the free tier** (which covers testing/demo):
- ✅ Unlimited projects
- ✅ Unlimited deployments
- ✅ 100GB/month bandwidth
- ✅ Advanced features available
- ⚠️ Database not included (SQLite is ephemeral)

**For production** (if needed):
- Upgrade to paid plan for premium features
- PostgreSQL/database support
- Advanced monitoring
- Higher limits

## Next Steps

1. ✅ Test your app thoroughly
2. ✅ Configure custom domain (optional)
3. ✅ Monitor performance in Vercel dashboard
4. ✅ Set up email notifications (Vercel settings)
5. ✅ Plan database migration if going beyond testing

## Support

If something goes wrong:

1. **Check Vercel logs**: Deployments → Click deployment → View log
2. **Check console errors**: Browser DevTools (F12)
3. **Test locally**: `npm start` to verify code works
4. **Verify variables**: Settings → Environment Variables
5. **Restart deployment**: Click redeploy button

## Celebrate! 🎉

Your Student Management System is now live on the internet!

**You can share it with anyone:**
```
https://student-management.vercel.app
```

**They can:**
- Create accounts
- Manage students
- See data in real-time
- Use it across devices

---

## Quick Reference Commands

```bash
# Push updates to live app
git add .
git commit -m "message"
git push origin main

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test locally
npm install
npm start
# Visit http://localhost:3000
```

Enjoy your deployed app! 🚀
