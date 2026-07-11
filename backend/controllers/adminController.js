import Admin from '../models/Admin.js';
import ClubCoordinator from '../models/ClubCoordinator.js';
import Participant from '../models/Participant.js';
import Event from '../models/Event.js';
import StudentCoordinator from '../models/StudentCoordinator.js';
import StaffCoordinator from '../models/StaffCoordinator.js';
import { hashPassword } from '../middleware/auth.js';

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const admins = await Admin.find({});
    const coordinators = await ClubCoordinator.find({});
    const participants = await Participant.find({});
    const events = await Event.find({});

    // De-duplicate students/participants by email
    const studentMap = {};
    participants.forEach((p) => {
      const emailLower = p.email.toLowerCase();
      if (!studentMap[emailLower]) {
        studentMap[emailLower] = p;
      }
    });

    const mappedAdmins = admins.map((a) => ({
      id: a._id.toString(),
      name: a.name || 'Administrator',
      email: a.email,
      phone: '',
      department: '',
      semester: '',
      role: 'admin',
      status: a.status || 'Active'
    }));

    const mappedCoordinators = coordinators.map((c) => {
      const eventsManaged = events.filter(e => e.createdBy === c.email).length;
      return {
        id: c._id.toString(),
        name: c.name,
        email: c.email,
        phone: c.phone,
        department: c.department,
        semester: '',
        role: 'coordinator',
        status: c.status || 'Active',
        clubName: c.clubName,
        description: c.description,
        eventsManaged
      };
    });

    const mappedStudents = Object.values(studentMap).map((s) => ({
      id: s._id.toString(),
      name: s.name,
      email: s.email,
      phone: s.phone,
      department: s.branch,
      semester: s.sem,
      role: 'student',
      status: s.status || 'Active',
      registration_id: s.registration_id
    }));

    res.json([...mappedAdmins, ...mappedCoordinators, ...mappedStudents]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:role/:id
export const updateUser = async (req, res) => {
  try {
    const { role, id } = req.params;
    const { name, email, phone, department, semester, description } = req.body;

    if (role === 'admin') {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      await Admin.findByIdAndUpdate(id, { $set: updateData });
    } else if (role === 'coordinator') {
      const coordinator = await ClubCoordinator.findById(id);
      if (!coordinator) {
        return res.status(404).json({ message: 'Coordinator not found' });
      }

      const originalEmail = coordinator.email;

      coordinator.name = name || coordinator.name;
      coordinator.email = email || coordinator.email;
      coordinator.phone = phone || coordinator.phone;
      coordinator.department = department || coordinator.department;
      coordinator.description = description || coordinator.description;
      await coordinator.save();

      // If name/phone/email changed, sync details in events owned by this coordinator
      if (name || phone || email) {
        const ownedEvents = await Event.find({ createdBy: originalEmail });
        const eventIds = ownedEvents.map(e => e.event_id);

        if (email) {
          await Event.updateMany({ createdBy: originalEmail }, { $set: { createdBy: email } });
        }

        if (coordinator.role === 'student_coordinator') {
          await StudentCoordinator.updateMany(
            { event_id: { $in: eventIds } },
            { $set: { st_name: coordinator.name, phone: coordinator.phone } }
          );
        } else {
          await StaffCoordinator.updateMany(
            { event_id: { $in: eventIds } },
            { $set: { name: coordinator.name, phone: coordinator.phone } }
          );
        }
      }
    } else if (role === 'student') {
      const student = await Participant.findById(id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const originalEmail = student.email;

      // Update all participant registration documents matching the email
      await Participant.updateMany(
        { email: originalEmail },
        {
          $set: {
            name: name || student.name,
            email: email || student.email,
            phone: phone || student.phone,
            branch: department || student.branch,
            sem: semester ? parseInt(semester) : student.sem
          }
        }
      );
    } else {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    res.json({ message: 'User updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:role/:id/status
export const toggleUserStatus = async (req, res) => {
  try {
    const { role, id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Active or Suspended.' });
    }

    if (role === 'admin') {
      if (status === 'Suspended') {
        const activeAdminsCount = await Admin.countDocuments({ status: 'Active' });
        if (activeAdminsCount <= 1) {
          return res.status(400).json({ message: 'Cannot suspend the last active administrator.' });
        }
      }
      await Admin.findByIdAndUpdate(id, { $set: { status } });
    } else if (role === 'coordinator') {
      await ClubCoordinator.findByIdAndUpdate(id, { $set: { status } });
    } else if (role === 'student') {
      const student = await Participant.findById(id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      // Toggle status for all registrations linked to this student email
      await Participant.updateMany({ email: student.email }, { $set: { status } });
    } else {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    res.json({ message: `User status changed to ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:role/:id
export const deleteUser = async (req, res) => {
  try {
    const { role, id } = req.params;

    if (role === 'admin') {
      const adminsCount = await Admin.countDocuments({});
      if (adminsCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last administrator account.' });
      }
      await Admin.findByIdAndDelete(id);
    } else if (role === 'coordinator') {
      await ClubCoordinator.findByIdAndDelete(id);
    } else if (role === 'student') {
      const student = await Participant.findById(id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      // Delete all registration documents for this student
      await Participant.deleteMany({ email: student.email });
    } else {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/coordinators/promote
export const promoteStudent = async (req, res) => {
  try {
    const { studentEmail, clubName, department, description, isStaff } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email is required.' });
    }

    const student = await Participant.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ message: 'Student registration details not found.' });
    }

    const existing = await ClubCoordinator.findOne({ email: studentEmail });
    if (existing) {
      return res.status(400).json({ message: 'This user is already a Coordinator.' });
    }

    const defaultPwdHash = hashPassword('coordinator123');

    await ClubCoordinator.create({
      name: student.name,
      email: student.email,
      phone: student.phone,
      clubName: clubName || 'Coding Club',
      department: department || student.branch || 'CSE',
      description: description || 'Promoted coordinator profile',
      password: defaultPwdHash,
      role: isStaff ? 'staff_coordinator' : 'student_coordinator',
      status: 'Active'
    });

    res.status(201).json({ message: `Promoted successfully! Default password is 'coordinator123'` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/coordinators/demote
export const demoteCoordinator = async (req, res) => {
  try {
    const { coordinatorId } = req.body;

    const coordinator = await ClubCoordinator.findById(coordinatorId);
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found.' });
    }

    await ClubCoordinator.findByIdAndDelete(coordinatorId);
    res.json({ message: 'Coordinator demoted back to Student successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/events/:event_id/transfer
export const transferEventOwnership = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { newCoordinatorEmail } = req.body;

    const event = await Event.findOne({ event_id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const coordinator = await ClubCoordinator.findOne({ email: newCoordinatorEmail });
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found with this email.' });
    }

    event.createdBy = newCoordinatorEmail;
    await event.save();

    // Sync names in StudentCoordinator or StaffCoordinator models
    if (coordinator.role === 'student_coordinator') {
      await StudentCoordinator.updateOne(
        { event_id },
        { $set: { st_name: coordinator.name, phone: coordinator.phone } },
        { upsert: true }
      );
    } else {
      await StaffCoordinator.updateOne(
        { event_id },
        { $set: { name: coordinator.name, phone: coordinator.phone } },
        { upsert: true }
      );
    }

    res.json({ message: 'Ownership transferred and sync complete!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/coordinators/:id/activity
export const getCoordinatorActivity = async (req, res) => {
  try {
    const coordinator = await ClubCoordinator.findById(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found.' });
    }

    const eventsCount = await Event.countDocuments({ createdBy: coordinator.email });
    const events = await Event.find({ createdBy: coordinator.email });
    const eventIds = events.map(e => e.event_id);

    const registrationsCount = await Participant.countDocuments({ event_id: { $in: eventIds } });

    res.json({
      eventsCount,
      registrationsCount,
      lastLogin: coordinator.lastLogin,
      status: coordinator.status,
      coordinatorDetails: {
        name: coordinator.name,
        email: coordinator.email,
        phone: coordinator.phone,
        clubName: coordinator.clubName,
        department: coordinator.department,
        role: coordinator.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/coordinators/:id/reset-password
export const resetCoordinatorPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const coordinator = await ClubCoordinator.findById(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found.' });
    }

    coordinator.password = hashPassword(newPassword);
    await coordinator.save();

    res.json({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
