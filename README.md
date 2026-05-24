# Bajaj Finserv Health Dev Challenge - Full Stack

This repository contains the complete full-stack implementation of the BFHL coding challenge, separated into `frontend` and `backend` folders for easy modularity.

## Repository Structure

```
bajaj-project/
│
├── backend/                  # Node.js + Express Backend
│   ├── package.json
│   ├── server.js
│   └── .gitignore
│
├── frontend/                 # React + Vite Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── components/
│   └── .gitignore
│
└── package.json              # Root package to install/run everything together
```

---

## 🚀 How to Run Locally in VS Code

You can either run the frontend and backend in separate terminal windows, or run the root script which builds everything and serves it together.

### Option 1: Run them completely separately (Best for Development)

**1. Start the Backend (API)**
1. Open a new terminal in VS Code (`Ctrl` + `` ` ``)
2. Run these commands:
   ```bash
   cd backend
   npm install
   node server.js
   ```
3. The backend API is now running on `http://localhost:3000`

**2. Start the Frontend (UI)**
1. Open a *second* terminal tab in VS Code.
2. Run these commands:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. The Vite frontend will start (usually on `http://localhost:5173`). Open that URL in your browser.

*(Note: the frontend automatically forwards API requests to `http://localhost:3000` via its code and `.env` configuration)*

### Option 2: Run Full-Stack together (Best for preview)
At the root folder of this project:
```bash
npm install
npm run dev
```
This builds the frontend and serves both the UI and API on `http://localhost:3000`.

---

## 🧪 How to Test Your API using Postman

Your backend allows testing the `/bfhl` endpoint independently.

### 1. GET Request
- **Method:** `GET`
- **URL:** `http://localhost:3000/bfhl`
- **Response:**
  ```json
  {
      "operation_code": 1
  }
  ```

### 2. POST Request
- **Method:** `POST`
- **URL:** `http://localhost:3000/bfhl`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "data": ["A", "C", "1", "3", "z"],
    "file_b64": "JVBERi0xLjMKJcfsj6IKNSAwIG9iago8PC9MZW5ndGggNiAwIFIvRmlsdGVyIC9GbGF0ZURlY29kZT4+"
  }
  ```
- **Expected Response:**
  ```json
  {
    "is_success": true,
    "user_id": "Keshav_Patidar_04082004",
    "email": "keshavpatidar231235@acropolis.in",
    "roll_number": "0827CI231060",
    "numbers": ["1", "3"],
    "alphabets": ["A", "C", "z"],
    "highest_lowercase_alphabet": ["z"],
    "is_prime_found": true,
    "file_valid": true,
    "file_mime_type": "application/pdf",
    "file_size_kb": "0.06"
  }
  ```

---

## 🌍 How to Deploy (Render + Netlify)

Since you have separated the `frontend` and `backend`, you can easily commit this entire repository to GitHub and deploy them separately.

### Step 1: Push to GitHub
1. Create a new repository on GitHub (name it something like `bajaj-finserv-challenge`).
2. Run these commands in your local project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/bajaj-finserv-challenge.git
   git push -u origin main
   ```

### Step 2: Deploy Backend to Render (Render.com)
1. Go to [Render.com](https://render.com) and create an account.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select your `bajaj-finserv-challenge` repository.
4. Fill in the deployment details:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Click **Create Web Service**.
6. Once deployed, Render will give you a URL (e.g., `https://bajaj-backend-xyz.onrender.com`). **Copy this URL**.

### Step 3: Deploy Frontend to Netlify (Netlify.com)
1. Go to [Netlify.com](https://netlify.com) and sign in.
2. Click **Add new site** -> **Import an existing project**.
3. Connect to GitHub and select the same `bajaj-finserv-challenge` repository.
4. Fill in the build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. **Environment Variables**: Add a new environment variable:
   - Key: `VITE_API_URL`
   - Value: The URL you got from Render (e.g., `https://bajaj-backend-xyz.onrender.com`)
6. Click **Deploy Site**.

You are now fully deployed! Submit your Netlify URL as the Frontend URL and the Render URL as the Backend URL in your application form.
