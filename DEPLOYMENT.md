# Deployment Guide — Placement Portal

This project is configured for deployment using:
- **Backend**: [Render](https://render.com/) (Express API Web Service)
- **Frontend**: [Vercel](https://vercel.com/) (Vite + React Static SPA)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Push Code to GitHub

Open a terminal at the project root (`placementportal`) and run:

```bash
git init
git add .
git commit -m "Initial commit: prepare for Vercel and Render deployment"
```

Then create a new repository on GitHub (e.g. `placement-portal`) and push:

```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/placement-portal.git
git push -u origin main
```

---

## Step 2: Configure MongoDB Atlas (Crucial)

Before deploying, ensure Render can access your database:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left sidebar, click **Network Access**.
3. Click **Add IP Address**.
4. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) and click **Confirm**.
   *(Cloud providers like Render use dynamic IP addresses, so `0.0.0.0/0` is required).*

---

## Step 3: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository (`placement-portal`).
4. Fill in the service configuration:
   - **Name**: `placementportal-backend` (or your choice)
   - **Region**: Choose the closest region (e.g., Singapore, Frankfurt, Oregon)
   - **Branch**: `main`
   - **Root Directory**: `server` *(Important!)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   - `MONGO_URI`: Your MongoDB connection string (from your `.env`)
   - `JWT_SECRET`: Your JWT secret string (from your `.env`)
   - `CLIENT_URL`: Temporary `*` (We will update this after getting the Vercel URL in Step 5)
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render backend URL (e.g., `https://placementportal-backend.onrender.com`).
8. Verify it by visiting `https://your-backend.onrender.com/api/health` in your browser. You should see `{"status":"ok", ...}`.

---

## Step 4: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Select your `placement-portal` repository and click **Import**.
4. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `client` *(Important!)*
   - **Build and Output Settings**: Leave as default (`npm run build` and `dist`)
5. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: `https://your-backend-name.onrender.com/api`
   - `VITE_SERVER_URL`: `https://your-backend-name.onrender.com`
   *(Replace with the actual Render URL obtained in Step 3)*
6. Click **Deploy**.
7. Once finished, Vercel will give you a live production URL (e.g., `https://placement-portal-xyz.vercel.app`).

---

## Step 5: Connect Backend to Frontend Domain (CORS)

1. Return to the [Render Dashboard](https://dashboard.render.com/).
2. Click on your `placementportal-backend` service -> **Environment**.
3. Update the `CLIENT_URL` environment variable:
   - Key: `CLIENT_URL`
   - Value: `https://your-frontend-domain.vercel.app` *(Your Vercel URL without a trailing slash)*
4. Click **Save Changes**. Render will automatically trigger a quick re-deploy.

---

## Step 6: Test Your Live App

1. Visit your Vercel URL.
2. Register a new user account.
3. Test login, viewing jobs, profile updates, and uploading a resume.

> **Note about Render Free Tier**:
> On the free plan, Render will spin down the backend service after 15 minutes of inactivity. When a request comes in after being idle, the initial wake-up can take 30 to 50 seconds. Subsequent requests will be instant.
