# 🎓 CampusConnect — Full Stack Student Management System

A complete **MERN-based** Student Management System with a vanilla HTML/CSS/JS frontend
communicating with an Express + MongoDB (Mongoose) REST API backend via the Fetch API.

---

## 📁 Complete Folder Structure

```
CampusConnect/
├── backend/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   └── studentController.js
│   ├── database/
│   │   └── connection.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── validateStudent.js
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── apiResponse.js
│   │   └── asyncHandler.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md   (this file)
```

---

## 🚀 How to Run the Backend (Windows PowerShell)

```powershell
cd CampusConnect\backend
npm install
copy .env.example .env
npm run dev
```

The server will start at: **http://localhost:5000**

> Edit the `.env` file and set your `MONGO_URI` before running (see MongoDB Atlas section below).

---

## 🌐 How to Run the Frontend

The frontend is plain HTML/CSS/JS, so no build tools are required.

**Option 1 — VS Code Live Server extension (Recommended)**
1. Open the `CampusConnect` folder in VS Code.
2. Right-click `frontend/index.html`.
3. Click **"Open with Live Server"**.
4. It will open at something like `http://127.0.0.1:5500/frontend/index.html`.

**Option 2 — Open directly in browser**
1. Navigate to the `frontend` folder in File Explorer.
2. Double-click `index.html` to open it in your browser.

> ⚠️ Make sure the backend server (`npm run dev`) is running on port 5000 before using the frontend.
> If your frontend origin differs from `http://127.0.0.1:5500`, update `CLIENT_ORIGIN` in your backend `.env` file to match, to avoid CORS errors.

---

## 🍃 How to Connect MongoDB Atlas

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in / sign up.
2. Create a **new Cluster** (the free M0 tier works fine).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`) for development.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
   ```
6. Open `backend/.env` and paste it into `MONGO_URI`, replacing `<username>`, `<password>`, and adding a database name (e.g. `campusconnect`):
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/campusconnect?retryWrites=true&w=majority
   ```
7. Save the file and restart the backend server (`npm run dev`).
8. You should see in the terminal:
   ```
   ✅ MongoDB Connected: cluster0-shard-...mongodb.net
   ```

**Using MongoDB locally instead?** Install MongoDB Community Server, run `mongod`, and set:
```
MONGO_URI=mongodb://127.0.0.1:27017/campusconnect
```

---

## 🧪 How to Test Using the Browser

1. Start the backend: `npm run dev` (inside `backend`).
2. Open your browser and go to: `http://localhost:9001`
   - You should see a JSON welcome message listing the available endpoints.
3. Open the frontend (`index.html`) via Live Server.
4. Use the **Add Student** form to create a student — it will appear instantly as a card below.
5. Click **Edit** on a card to modify a student, or **Delete** to remove one (with confirmation).
6. Try stopping the backend server while the frontend is open, then click **Refresh** — you should see a friendly network error message.

---

## 📮 How to Test Using Postman

1. Open Postman and create a new Collection called **CampusConnect**.
2. Base URL: `http://localhost:9001/api/students`

| Action | Method | URL | Body (JSON) |
|--------|--------|-----|--------------|
| Get all students | GET | `/api/students` | — |
| Get one student | GET | `/api/students/:id` | — |
| Create student | POST | `/api/students` | `{ "name": "Priya Sharma", "email": "priya@example.com", "course": "B.Tech CSE", "age": 21 }` |
| Update student | PUT | `/api/students/:id` | `{ "name": "Priya S.", "email": "priya@example.com", "course": "B.Tech AI/ML", "age": 22 }` |
| Delete student | DELETE | `/api/students/:id` | — |

**Steps:**
1. Set the request method and URL as per the table above.
2. For POST/PUT requests, go to the **Body** tab → select **raw** → choose **JSON** → paste the sample body.
3. Click **Send**.
4. You should receive a JSON response like:
   ```json
   {
     "success": true,
     "message": "Student created successfully",
     "data": { "_id": "...", "name": "Priya Sharma", "email": "priya@example.com", "course": "B.Tech CSE", "age": 21, "createdAt": "...", "updatedAt": "..." }
   }
   ```
5. To test error handling, try:
   - GET/PUT/DELETE with an invalid ID (e.g. `/api/students/123`) → expect a `400` response.
   - GET/PUT/DELETE with a well-formed but non-existent ID → expect a `404` response.
   - POST with a missing field (e.g. no `email`) → expect a `400` validation error response.

---

## ✅ Features Implemented

- Full CRUD (Create, Read, Update, Delete) via Fetch API with async/await
- Card-based, responsive, modern UI
- Client-side + server-side validation
- Loading spinner while fetching data
- Success and error toast notifications
- Confirmation modal before deleting
- Empty state when no students exist
- Graceful handling of 404, 500, and network errors
- Clean modular backend structure (config, controllers, database, middleware, models, routes, utils)

---

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript, Fetch API
**Backend:** Node.js, Express.js, MongoDB, Mongoose, dotenv, cors, nodemon
