import StudentCoordinator from '../models/StudentCoordinator.js';
import StaffCoordinator from '../models/StaffCoordinator.js';
import ClubCoordinator from '../models/ClubCoordinator.js';
import Event from '../models/Event.js';

export const getStudentCoordinators = async (req, res) => {
  try {
    // 1. Fetch from StudentCoordinator
    const studentCoords = await StudentCoordinator.find({});
    const detailedStudentCoords = await Promise.all(
      studentCoords.map(async (coord) => {
        const event = await Event.findOne({ event_id: coord.event_id });
        return {
          sid: coord.sid,
          st_name: coord.st_name,
          phone: coord.phone,
          event_id: coord.event_id,
          event_title: event ? event.event_title : ''
        };
      })
    );

    // 2. Fetch active student club coordinators from ClubCoordinator
    const clubCoords = await ClubCoordinator.find({ role: 'student_coordinator', status: 'Active' });
    const detailedClubCoords = clubCoords.map((coord) => {
      return {
        sid: coord._id.toString(),
        st_name: coord.name,
        phone: coord.phone,
        event_id: coord._id.toString(),
        event_title: coord.clubName
      };
    });

    // 3. Merge and return
    res.json([...detailedStudentCoords, ...detailedClubCoords]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffCoordinators = async (req, res) => {
  try {
    // 1. Fetch from StaffCoordinator
    const staffCoords = await StaffCoordinator.find({});
    const detailedStaffCoords = await Promise.all(
      staffCoords.map(async (coord) => {
        const event = await Event.findOne({ event_id: coord.event_id });
        return {
          stid: coord.stid,
          name: coord.name,
          phone: coord.phone,
          event_id: coord.event_id,
          event_title: event ? event.event_title : ''
        };
      })
    );

    // 2. Fetch active staff club coordinators from ClubCoordinator
    const clubCoords = await ClubCoordinator.find({ role: 'staff_coordinator', status: 'Active' });
    const detailedClubCoords = clubCoords.map((coord) => {
      return {
        stid: coord._id.toString(),
        name: coord.name,
        phone: coord.phone,
        event_id: coord._id.toString(),
        event_title: coord.clubName
      };
    });

    // 3. Merge and return
    res.json([...detailedStaffCoords, ...detailedClubCoords]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudentCoordinator = async (req, res) => {
  try {
    const id = req.params.id; // String ID mapping
    const { st_name, phone } = req.body;

    // Check if it exists in ClubCoordinator first
    const clubResult = await ClubCoordinator.updateOne(
      { _id: id },
      { $set: { name: st_name, phone } }
    );

    if (clubResult.matchedCount > 0) {
      return res.json({ message: 'Updated Successfully' });
    }

    // Otherwise update in StudentCoordinator
    const result = await StudentCoordinator.updateOne(
      { sid: id },
      { $set: { st_name, phone } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }

    res.json({ message: 'Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStaffCoordinator = async (req, res) => {
  try {
    const id = req.params.id; // String ID mapping
    const { name, phone } = req.body;

    // Check if it exists in ClubCoordinator first
    const clubResult = await ClubCoordinator.updateOne(
      { _id: id },
      { $set: { name, phone } }
    );

    if (clubResult.matchedCount > 0) {
      return res.json({ message: 'Updated Successfully' });
    }

    // Otherwise update in StaffCoordinator
    const result = await StaffCoordinator.updateOne(
      { stid: id },
      { $set: { name, phone } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }

    res.json({ message: 'Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
