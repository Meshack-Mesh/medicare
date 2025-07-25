
# 🏥 Medicare — Patient Management System

**Medicare** is a full-stack web application built to streamline and digitize the management of patient data, registration, authentication, and appointments in a healthcare facility. It provides role-based access for administrators, doctors, and patients to interact securely and efficiently.

---

## 🚀 Project Overview

This project aims to:
- Simplify patient data collection and retrieval
- Enable user registration and login with role-based access
- Allow doctors to view and manage patient records
- Provide patients with access to their personal information and appointments

---

## 🌐 Live URLs

- 🔗 **Frontend (Vercel)**: [https://medicare-e91ar6j53-meshack-meshs-projects.vercel.app](https://medicare-e91ar6j53-meshack-meshs-projects.vercel.app)
- 🔗 **Backend (Render)**: [https://medicare-jas6.onrender.com](https://medicare-jas6.onrender.com)

---

## 🧑‍💻 Tech Stack

### Frontend (Vite + React + Tailwind CSS)
- React Router DOM
- Axios
- ShadCN UI
- Lucide React (icons)

### Backend (Node.js + Express + MongoDB)
- Express.js for routing
- MongoDB + Mongoose for data modeling
- BcryptJS for password hashing
- JSON Web Tokens (JWT) for authentication
- dotenv for environment config
- CORS for cross-origin access

---

## 🔐 Core Features

### 👥 Authentication
- User registration with name, email, password, and role (admin, doctor, patient)
- Secure login and token-based authentication
- Role-based dashboard access

### 📋 Patient Management
- Add new patients
- View all patients
- View patient details by ID

### 🧪 Doctor Dashboard
- Upload and view medical records
- Assign appointments and prescriptions

### 💊 Patient Portal 
- View personal medical records
- See upcoming appointments

---

## 📁 Project Structure

### Backend (`/server`)
```

server/
├── controllers/
├── models/
├── routes/
├── .env
├── server.js

```

### Frontend (`/client`)
```

client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js

````

---

## ⚙️ Getting Started Locally

### 📦 Backend Setup

```bash
cd server
npm install
touch .env
````

Add your environment variables in `.env`:

```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_secret_key
```

Run the server:

```bash
npm start
```

### 🖥️ Frontend Setup

```bash
cd client
npm install
```

Make sure the Vite environment points to your backend in `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

---

## 📦 Deployment

### Backend

* Hosted on [Render](https://render.com)
* MongoDB hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Frontend

* Deployed via Vercel



## 🧪 Future Improvements

* Doctor appointment scheduling
* Chat system between doctor and patient
* Admin analytics dashboard
* Upload and view medical files (Multer + Cloudinary)

---

## 📬 Contact

Developed by [Meshack Mwima](https://github.com/Meshack-Mesh)
