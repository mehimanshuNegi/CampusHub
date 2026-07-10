import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import eventRoutes from './routes/eventRoutes.js';
import participantRoutes from './routes/participantRoutes.js';
import coordinatorRoutes from './routes/coordinatorRoutes.js';
import clubCoordinatorRoutes from './routes/clubCoordinatorRoutes.js';
import Admin from './models/Admin.js';
import ClubCoordinator from './models/ClubCoordinator.js';
import { activeSessions, hashPassword, comparePassword } from './middleware/auth.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images statically
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/coordinators', coordinatorRoutes);
app.use('/api/club-coordinators', clubCoordinatorRoutes);

// Unified Authentication Endpoint (Admins & Club Coordinators)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 1. Check Admin Database
    const admin = await Admin.findOne({ email });
    if (admin && comparePassword(password, admin.password)) {
      const token = 'ADM-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      activeSessions[token] = {
        email: admin.email,
        role: 'admin',
        name: 'Administrator'
      };

      return res.json({
        message: 'Login Successfull',
        email: admin.email,
        role: 'admin',
        name: 'Administrator',
        token
      });
    }

    // 2. Check Club Coordinator Database
    const coordinator = await ClubCoordinator.findOne({ email });
    if (coordinator && comparePassword(password, coordinator.password)) {
      const token = 'CO-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      activeSessions[token] = {
        email: coordinator.email,
        role: 'coordinator',
        id: coordinator._id,
        name: coordinator.name,
        clubName: coordinator.clubName
      };

      return res.json({
        message: 'Login Successfull',
        email: coordinator.email,
        role: 'coordinator',
        name: coordinator.name,
        token
      });
    }

    res.status(400).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Session Verification Endpoint (Reads activeSessions dict)
app.post('/api/auth/verify-session', (req, res) => {
  try {
    const { token } = req.body;
    if (token && activeSessions[token]) {
      const session = activeSessions[token];
      res.json({
        authenticated: true,
        role: session.role,
        email: session.email,
        name: session.name
      });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    res.status(500).json({ authenticated: false, message: error.message });
  }
});

// User Session Logout
app.post('/api/auth/logout', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let token = authHeader ? authHeader.split(' ')[1] : null;
    if (!token) {
      token = req.headers['x-auth-token'] || req.body.token || req.query.token;
    }

    if (token && activeSessions[token]) {
      delete activeSessions[token];
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Account Settings Update
app.put('/api/auth/settings', async (req, res) => {
  try {
    const { currentEmail, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let admin = await Admin.findOne({ email: currentEmail });
    if (!admin) {
      admin = await Admin.findOne({});
    }

    const hashedPwd = hashPassword(password);

    if (admin) {
      admin.email = email;
      admin.password = hashedPwd;
      await admin.save();
    } else {
      await Admin.create({ email, password: hashedPwd });
    }

    // Sync any active admin sessions
    for (let token in activeSessions) {
      if (activeSessions[token].role === 'admin' && activeSessions[token].email === currentEmail) {
        activeSessions[token].email = email;
      }
    }

    res.json({ message: 'Settings Updated Successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
