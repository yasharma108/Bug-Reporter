# AI-Powered Bug Reporting System 🐛🤖

A full-stack, modern MERN (MongoDB, Express, React/VanillaJS, Node.js) web application designed to help developers track bugs effectively. This platform features a premium Glassmorphism UI, intelligent bug sorting, a critical "Triage Mode" for severe bugs, and a built-in integration with Google's Gemini AI to instantly generate debugging solutions for raw code snippets!

---

## ✨ Features

- **Robust User Authentication**: Secure login and signup with client-side RegEx validation and server-side JWT session handling.
- **Smart Priority Triage**: A dynamic dashboard that automatically analyzes open bugs and highlights the highest severity task in an urgent banner, ensuring developers tackle critical issues first.
- **AI Debugging Integration**: Paste broken code directly into a bug ticket. The backend passes the code, severity, and description to Google Gemini AI to instantly suggest a fix on the dashboard.
- **Glassmorphism UI Aesthetic**: Stunning visual design using modern CSS best practices (gradients, backdrop-filters, custom scrollbars) tailored to look extremely premium and responsive.
- **Full CRUD Application**: Create, Read, Update (Status), and Delete bugs seamlessly with immediate frontend state updates.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, Modern Vanilla CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODMs)
- **AI Integration:** Google GenAI SDK (`@google/genai`)

---

## 🚀 How to Run Locally

If you want to run this application on your own machine, follow these steps:

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) installed
- A MongoDB Atlas Account or local MongoDB Server
- A [Google AI Studio API Key](https://aistudio.google.com/app/apikey) (Free)

### 2. Setup the Backend

1. Open your terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a file named `.env` inside the `server/` folder and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your_db
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   _(Make sure not to write `< >` brackets around your actual password!)_
4. Start the server:
   ```bash
   node server.js
   ```

### 3. Setup the Frontend

1. Open the `client/js/config.js` file.
2. Ensure the URL is pointing to your local backend:
   ```javascript
   const BACKEND_URL = "http://localhost:5000";
   ```
3. Open `client/index.html` (or `client/login.html`) in any web browser!

---

## 📖 How it Works / Manual

**1. Creating an Account:**
Navigate to `signup.html`. Provide a valid email and a secure password (must contain at least 6 characters, including a letter and a number). Upon success, you are routed to the login page.

**2. Writing a Bug Report:**
On your personalized Dashboard, fill out the intuitive submission bar.

- You can write the **Title/Description**.
- Select the **Severity** (High, Medium, Low).
- You can optionally paste your raw broken code directly into the **Code Snippet** box.

**3. Triage Mode:**
Whenever you log in, the system scans your unresolved bugs. If you have "High" severity bugs waiting, a red siren banner will take over the top of the screen directing you exactly to the problem you need to fix first.

**4. The "Get AI Solution" Button:**
On any bug card, click the shiny green `Get AI Solution` button. Your browser will ping the Node server, which translates your bug report and code snippet into an AI Prompt. Gemini determines the root cause and streams a 3-sentence solution back into your dashboard in real-time!

---
