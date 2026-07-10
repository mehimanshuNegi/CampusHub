import bcrypt from 'bcryptjs';

// In-memory active session store (token -> sessionDetails)
export const activeSessions = {};

// Helper to hash password using bcryptjs
export const hashPassword = (password) => {
  if (!password) return '';
  return bcrypt.hashSync(password, 10);
};

// Helper to compare password against bcrypt hash
export const comparePassword = (password, hashed) => {
  if (!password || !hashed) return false;
  return bcrypt.compareSync(password, hashed);
};

// Security middleware checking session credentials and role permissions
export const authenticateToken = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      let token = authHeader ? authHeader.split(' ')[1] : null;
      if (!token) {
        token = req.headers['x-auth-token'] || req.body.token || req.query.token;
      }

      if (!token) {
        return res.status(401).json({ message: 'Access Denied: No authentication token found.' });
      }

      const session = activeSessions[token];
      if (!session) {
        return res.status(401).json({ message: 'Session expired or invalid. Please sign in again.' });
      }

      req.user = session;

      if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient privileges.' });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: 'Authentication checking failure: ' + err.message });
    }
  };
};
