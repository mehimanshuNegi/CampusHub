# CampusHub

CampusHub is a responsive college event activities portal designed to centralize event registrations, scheduling configurations, logistics details, and coordinator outreach in a single clean workspace.

---

## 🛠️ Technology Stack
- **Frontend**: React (Vite, Single Page Application), Vanilla CSS variables (supporting native Dark Mode), Lucide Icons, Axios client
- **Backend**: Node.js + Express.js API Gateway
- **Database**: MongoDB (via Mongoose ODM)

---

## 📂 Repository Structure
```
CampusHub/
├── backend/
│   ├── config/          # MongoDB connection configuration
│   ├── controllers/     # Controller modules for event and registration logic
│   ├── models/          # Mongoose schema definitions (Admin, Event, Participant)
│   ├── routes/          # Express API route mapping
│   ├── seed.js          # Database seeding script (drops DB & rebuilds clean)
│   └── server.js        # Backend Express server gateway
└── frontend/
    ├── public/          # Static assets (images, CSS styles, fonts)
    └── src/
        ├── components/  # Reusable UI components (Navbar, Footer, AdminNavbar)
        ├── pages/       # Page views (LandingPage, EventsList, EventDetails, etc.)
        ├── App.jsx      # Navigation, clean routing table, and compatibility redirects
        └── main.jsx     # Frontend entry point
```

---

## 🚀 Installation & Run Instructions

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v16 or higher)
- **MongoDB** running locally on port `27017`

### 2. Database Setup & Seeding
1. Open a terminal and navigate to the `backend/` directory.
2. Run the database seed script to clear the old database and seed active events, administrators, and participant registrations:
   ```bash
   node seed.js
   ```

### 3. Run the Backend API Server
1. Inside the `backend/` directory, ensure dependencies are installed:
   ```bash
   npm install
   ```
2. Start the Express API server (running on port `5001`):
   ```bash
   npm start
   ```

### 4. Run the Frontend Development Server
1. Open a new terminal and navigate to the `frontend/` directory.
2. Ensure dependencies are installed:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000/](http://localhost:3000/) in your browser.

---

## 💼 Portal Credentials

### Admin Portal
- **Email**: `admin@campushub.com`
- **Password**: `admin123` (can be updated via the Account Settings page)

### Club Coordinator Portal (Sample)
- **Email**: `coordinator@campushub.com`
- **Password**: `coordinator123`

> All passwords are hashed with **bcryptjs** (10 salt rounds). Never stored in plaintext.

### Sample Student Registrations
- **Registration IDs**: `CH-0001`, `CH-0002`
- **Cancellation Password**: `1234` (for seeded mock registrations)

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Public** | Browse events, register, view/cancel registrations |
| **Club Coordinator** | Login, manage own events, view participants, update profile |
| **Admin** | Full access: all events, coordinator requests, approve/reject, account settings |

---

## 🔒 Security Features
- bcryptjs password hashing (Admin & Coordinator accounts)
- Token-based session authentication (in-memory activeSessions store)
- Role-based route protection (ProtectedRoute component + backend middleware)
- Coordinators cannot access admin pages or modify other coordinators' events

---

## 👨‍💻 Developer
**Himanshu Negi** — MERN Stack Summer Training Project
