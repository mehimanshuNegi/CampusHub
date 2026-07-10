<h1 align="center">🎓 CampusHub</h1>

<p align="center">
A modern <b>MERN Stack College Event Management System</b> that simplifies event registration, club coordination, and administration through a clean and responsive web application.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</p>

---

# ✨ Features

## 👨‍🎓 Public Users

- 📅 Browse upcoming events
- 🔍 Explore events by category
- 📖 View detailed event information
- 📝 Register for free and paid events
- 🆔 Auto-generated Registration ID
- 🔎 Registration lookup
- ❌ Cancel registration
- 💳 Track payment verification status
- 🌙 Light & Dark Mode
- 📱 Fully Responsive Design

---

## 🏛️ Club Coordinators

- 📨 Apply to become a coordinator
- 🔐 Secure Login
- 📊 Coordinator Dashboard
- ➕ Create Events
- ✏️ Edit Own Events
- 🗑️ Delete Own Events
- 👥 View Registered Participants
- ✔️ Verify Payments
- 👤 Update Profile

---

## 👨‍💼 Administrator

- 🔐 Secure Admin Login
- 📈 Dashboard Analytics
- 📅 Manage Events
- 👥 Manage Coordinators
- ✅ Approve / Reject Coordinator Requests
- 📋 View Registrations
- 💳 Verify Payments
- ⚙️ Update Administrator Credentials

---

# 🛠️ Tech Stack

### 🎨 Frontend

- ⚛️ React
- ⚡ Vite
- 🛣️ React Router
- 🌐 Axios
- 🎨 Vanilla CSS

### 🖥️ Backend

- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB
- 📦 Mongoose
- 🔒 bcryptjs

### ☁️ Deployment

- ▲ Vercel
- 🚂 Render
- 🍃 MongoDB Atlas

---

# 📂 Project Structure

```text
CampusHub
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed.js
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# 👥 User Roles

| Role | Access |
|------|--------|
| 👨‍🎓 Public User | Browse events, Register, View Registration, Cancel Registration |
| 🏛️ Club Coordinator | Create & Manage Own Events, Verify Payments, View Participants |
| 👨‍💼 Administrator | Full Platform Access |

---

# 🚀 Installation

## 📥 Clone Repository

```bash
git clone https://github.com/mehimanshuNegi/CampusHub.git

cd CampusHub
```

---

## 🖥️ Backend Setup

```bash
cd backend

npm install

node seed.js

npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5001

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY
```

---

# 🔐 Default Credentials

## 👨‍💼 Administrator

```text
Email:
admin@campushub.com

Password:
admin123
```

---

## 🏛️ Club Coordinator

```text
Email:
coordinator@campushub.com

Password:
coordinator123
```

---

# 📌 Core Modules

- 📅 Event Management
- 🎯 Event Categories
- 📝 Event Registration
- 🆔 Registration Lookup
- ❌ Registration Cancellation
- 👨‍💼 Coordinator Portal
- 📊 Coordinator Dashboard
- ⚙️ Admin Dashboard
- 💳 Payment Verification
- 🔒 Authentication & Authorization
- 👥 Role-Based Access Control
- 🌙 Dark Mode

---

# 🔒 Security

- 🔐 bcrypt Password Hashing
- 🛡️ Protected Routes
- 👥 Role-Based Authorization
- 🔑 Secure Authentication
- ✔️ Input Validation
- 🌱 Environment Variables

---

# 🚀 Future Improvements

- 📧 Email Notifications
- 🎟️ QR Code Check-in
- 📊 Event Analytics
- ☁️ Cloud Image Storage
- 📜 Certificate Generation

---

# 👨‍💻 Developer

**Himanshu Negi**

B.Tech Computer Science Engineering

⭐ If you like this project, consider giving it a star!

---

# 📄 License

This project is developed for educational purposes and portfolio demonstration.
