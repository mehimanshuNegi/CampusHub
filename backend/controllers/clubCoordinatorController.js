import CoordinatorRequest from '../models/CoordinatorRequest.js';
import ClubCoordinator from '../models/ClubCoordinator.js';
import { hashPassword } from '../middleware/auth.js';

// Student / Faculty submits a request to become a Club Coordinator
export const submitCoordinatorRequest = async (req, res) => {
  try {
    const { name, email, phone, clubName, department, description, password, role } = req.body;

    if (!name || !email || !phone || !clubName || !department || !description || !password || !role) {
      return res.status(400).json({ message: 'All registration parameters are required.' });
    }

    // Check if email already registered as coordinator
    const existingCoordinator = await ClubCoordinator.findOne({ email });
    if (existingCoordinator) {
      return res.status(400).json({ message: 'This email is already registered as an active Club Coordinator.' });
    }

    // Check if email already has a pending application request
    const existingRequest = await CoordinatorRequest.findOne({ email, status: 'Pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'A pending coordinator application with this email already exists.' });
    }

    // Create a new request record
    await CoordinatorRequest.create({
      name,
      email,
      phone,
      clubName,
      department,
      description,
      password: hashPassword(password),
      role
    });

    res.status(201).json({ message: 'Application request submitted successfully! Pending administrator approval.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin views list of coordinator requests (ordered by date)
export const getCoordinatorRequests = async (req, res) => {
  try {
    const requests = await CoordinatorRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves request: updates status and creates ClubCoordinator profile
export const approveCoordinatorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await CoordinatorRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Application request not found.' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Request is already in '${request.status}' status.` });
    }

    // Check if email already registered as coordinator
    let coordinator = await ClubCoordinator.findOne({ email: request.email });
    if (!coordinator) {
      coordinator = await ClubCoordinator.create({
        name: request.name,
        email: request.email,
        phone: request.phone,
        clubName: request.clubName,
        department: request.department,
        description: request.description,
        password: request.password,
        role: request.role,
        status: 'Active'
      });
    } else {
      coordinator.name = request.name;
      coordinator.phone = request.phone;
      coordinator.clubName = request.clubName;
      coordinator.department = request.department;
      coordinator.description = request.description;
      coordinator.role = request.role;
      coordinator.status = 'Active';
      await coordinator.save();
    }

    // Mark request as Approved
    request.status = 'Approved';
    await request.save();

    res.json({ message: 'Application approved successfully! Coordinator account is now active.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin rejects request: updates status
export const rejectCoordinatorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await CoordinatorRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Application request not found.' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Request is already in '${request.status}' status.` });
    }

    request.status = 'Rejected';
    await request.save();

    res.json({ message: 'Application request rejected successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Coordinator views their profile
export const getCoordinatorProfile = async (req, res) => {
  try {
    const coordinator = await ClubCoordinator.findOne({ email: req.user.email });
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator profile not found.' });
    }
    
    // Omit password from returning profile data
    const { password, ...safeDetails } = coordinator.toObject();
    res.json(safeDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Coordinator updates their profile
export const updateCoordinatorProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const coordinator = await ClubCoordinator.findOne({ email: req.user.email });

    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator profile not found.' });
    }

    if (name) coordinator.name = name;
    if (phone) coordinator.phone = phone;
    if (password) coordinator.password = hashPassword(password);

    await coordinator.save();
    res.json({ message: 'Coordinator Profile Updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
