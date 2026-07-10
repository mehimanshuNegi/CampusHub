# 🎓 CampusHub

> **A Modern MERN Stack College Event Management System**

CampusHub is a full-stack web application built using the **MERN Stack** to simplify college event management. It enables students to explore and register for events, allows club coordinators to manage their own events, and provides administrators with a centralized dashboard to manage the entire platform.

🌐 **Live Demo:** [CampusHub Live Website](https://campushub-frontend-7zby.onrender.com/?utm_source=chatgpt.com)

---

## ✨ Features

### 👨‍🎓 Public Users

* 🏠 Modern responsive landing page
* 🎉 Browse events by category
* 📄 View complete event details
* 📝 Register for events
* 🆔 Auto-generated Registration ID
* 🔍 Registered Event lookup
* ❌ Cancel registration using Registration ID & Password
* 💰 Paid event registration with:

  * Transaction ID
  * Payment Screenshot Upload
* 🌙 Dark Mode support

---

### 👨‍💼 Club Coordinator

* 🔐 Secure Login
* 📊 Coordinator Dashboard
* ➕ Create Events
* ✏️ Edit Events
* 🗑️ Delete Events
* 👥 View Registered Participants
* 💳 Verify Student Payments
* 👤 Update Profile
* 📩 Apply to Become a Club Coordinator (Admin Approval Required)

---

### 👨‍💻 Administrator

* 🔐 Secure Admin Login
* 📈 Dashboard with statistics
* 🎉 Manage all Events
* 👥 Manage Coordinators
* ✅ Approve / Reject Coordinator Requests
* 📋 View Registered Students
* ⚙️ Update Admin Credentials
* 📊 Monitor Registrations & Payments

---

# 🛠 Tech Stack

| Category        | Technology                      |
| --------------- | ------------------------------- |
| Frontend        | React + Vite                    |
| Backend         | Node.js + Express.js            |
| Database        | MongoDB Atlas                   |
| ODM             | Mongoose                        |
| Authentication  | JWT + Role-Based Authentication |
| Styling         | CSS Modules & Vanilla CSS       |
| HTTP Client     | Axios                           |
| Deployment      | Render                          |
| Version Control | Git & GitHub                    |

---

# 📁 Project Structure

```text
CampusHub/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/mehimanshuNegi/CampusHub.git

cd CampusHub
```

---

## 2️⃣ Backend Setup

```bash
cd backend

npm install

npm start
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🌐 Deployment

### Frontend

* Render Static Site

### Backend

* Render Web Service

### Database

* MongoDB Atlas

---

# 👥 User Roles

| Role             | Permissions                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| Public User      | Browse events, register, lookup registration, cancel registration      |
| Club Coordinator | Manage own events, verify payments, view participants                  |
| Administrator    | Manage platform, approve coordinators, manage events and registrations |

---

# 💳 Event Registration Flow

```text
Browse Events
      │
      ▼
View Event Details
      │
      ▼
Register
      │
      ▼
Payment (If Required)
      │
      ▼
Registration Successful
      │
      ▼
Registration ID Generated
      │
      ▼
Lookup / Cancel Registration
```

---

# 🔒 Security Features

* 🔐 JWT Authentication
* 🔑 bcrypt Password Hashing
* 🛡️ Role-Based Access Control
* ✅ Protected Routes
* 🌐 Secure CORS Configuration
* 📁 Secure File Upload Handling

---

# 📱 Highlights

* ✅ Fully Responsive Design
* 🌙 Dark Mode
* 📊 Dashboard Analytics
* 💳 Payment Verification
* 🎯 Clean & Modern UI
* ⚡ Fast React + Vite Frontend
* ☁️ Cloud Database (MongoDB Atlas)
* 🚀 Deployed on Render

---

# 📸 Screenshots

> Add screenshots of:

* 🏠 Landing Page
* 🎉 Events Page
* 📄 Event Details
* 📝 Registration Form
* 👨‍💼 Coordinator Dashboard
* 👨‍💻 Admin Dashboard
* 🌙 Dark Mode

---

# 🎯 Future Improvements

* 📧 Email Notifications
* 📱 QR Code Based Event Check-in
* 📄 Certificate Generation
* 📈 Advanced Analytics
* 🔔 Real-time Notifications
* 📅 Calendar Integration

---

# 👨‍💻 Developer

**Himanshu Negi**

B.Tech CSE Student

GitHub: https://github.com/mehimanshuNegi

---

## ⭐ If you like this project, consider giving it a Star!
