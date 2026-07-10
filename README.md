# CampusHub

A modern **MERN Stack College Event Management System** that simplifies event discovery, registrations, club coordination, and administration through a clean, responsive web application.

CampusHub provides separate workflows for **Public Users**, **Club Coordinators**, and **Administrators**, making event management organized, secure, and easy to use.

---

## Features

### Public Users

- Browse upcoming events
- Explore events by category
- View complete event details
- Register for free and paid events
- Auto-generated Registration ID
- Registration lookup
- Registration cancellation
- Track payment verification status
- Responsive interface
- Light & Dark Mode

### Club Coordinators

- Apply to become a coordinator
- Secure login
- Dashboard overview
- Create events
- Edit own events
- Delete own events
- View registered participants
- Verify payment transactions
- Update profile information

### Administrator

- Secure admin login
- Dashboard with statistics
- Manage all events
- Manage registrations
- Approve or reject coordinator requests
- Manage coordinators
- Verify payments
- Update administrator credentials

---

# Technology Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Vanilla CSS
- Responsive Design

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs

## Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

# Project Structure

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
│   ├── package.json
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
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# User Roles

| Role | Permissions |
|------|-------------|
| Public User | Browse events, register, check registration, cancel registration |
| Club Coordinator | Create and manage own events, verify payments, view participants |
| Administrator | Manage events, coordinators, registrations, payments, and platform settings |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/mehimanshuNegi/CampusHub.git

cd CampusHub
```

---

## Backend

```bash
cd backend

npm install

node seed.js

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5001

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY
```

---

# Default Credentials

## Administrator

```
Email:
admin@campushub.com

Password:
admin123
```

---

## Club Coordinator

```
Email:
coordinator@campushub.com

Password:
coordinator123
```

---

# Core Modules

- Event Management
- Event Categories
- Event Registration
- Registration Verification
- Registration Cancellation
- Coordinator Application System
- Coordinator Dashboard
- Administrator Dashboard
- Payment Verification
- Authentication & Authorization
- Role-Based Access Control
- Dark Mode

---

# Security

- bcrypt password hashing
- Protected Routes
- Role-Based Authorization
- Secure Authentication
- Input Validation
- Environment Variable Configuration

---

# Future Scope

- QR Code based event check-in
- Email notifications
- Attendance management
- Event analytics
- Cloud image storage
- Certificate generation

---

# Developer

**Himanshu Negi**

B.Tech Computer Science Engineering

---

# License

This project is intended for educational purposes and portfolio demonstration.
