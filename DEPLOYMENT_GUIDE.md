# Deployment Guide: Render & Vercel

Congratulations on completing your assignment! You have built a fully functional MERN-stack style application (HTML/JS + Node.js/Express + MongoDB). 
I've already updated your codebase so that it is perfectly designed to be deployed cleanly. Just follow these exact steps:

## Step 1: Push your Code to GitHub
Both Render and Vercel will pull your code directly from a GitHub repository to deploy it automatically. So we need to put it there first.
1. Create a new empty repository on GitHub.
2. In your terminal (make sure you are in the *root folder*: `/home/yash-sharma/Coding/bug_reporting`), run these commands:
```bash
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy the Backend to Render
1. Go to [Render.com](https://render.com) and create an account using your GitHub.
2. Click **New** -> **Web Service**.
3. Connect your GitHub account and select your newly created repository.
4. **Configure the Service parameters:**
   - **Name**: `bug-reporting-backend` (or whatever you prefer)
   - **Root Directory**: `server` *(Crucial step: it tells Render that your backend is in the server folder!)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Add Environment Variables:** Scroll down to the Environment Variables section and enter all the secrets you have in your local `.env` file!
   - `MONGO_URI` = `mongodb+srv://...` (Your MongoDB connection string)
   - `GEMINI_API_KEY` = `your_google_ai_key` 
   - `PORT` = `5000`
6. Click **Create Web Service**. Wait a few minutes while Render installs your packages. Once it says "Live", copy the custom URL they give you (e.g., `https://bug-backend-xxxx.onrender.com`).

## Step 3: Connect Frontend to the new Backend
Now we need to tell your frontend where the backend lives on the internet (it's no longer on `localhost:5000`). I just made a neat `config.js` file for you so you only have to do this once!
1. Open the file `client/js/config.js` in your VS Code.
2. Change the string to the Render URL you just copied:
```javascript
// BEFORE
const BACKEND_URL = "http://localhost:5000";

// AFTER
const BACKEND_URL = "https://bug-backend-xxxx.onrender.com";
```
3. Save, commit, and push this tiny change to GitHub so Vercel can see it:
```bash
git add client/js/config.js
git commit -m "Configure production backend URL"
git push
```

## Step 4: Deploy the Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and import your GitHub repository.
3. **Configure the Project parameters:**
   - **Framework Preset**: `Other`
   - **Root Directory**: Click "Edit", and explicitly select the `client` folder.
4. Click **Deploy**. Vercel will automatically host your `client` folder for free!
5. After a few seconds, it will glow green and give you a live URL.

## Step 5: Test it Live!
Go to your Vercel URL and add `/login.html` to the end of it (e.g., `https://my-vercel-app.vercel.app/login.html`). You can now sign up, log in, create bugs, and watch Gemini solve them directly on the public internet.

You can submit your assigned Vercel URL as your final assignment link! Good luck!
