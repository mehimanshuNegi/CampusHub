import StudentCoordinator from '../models/StudentCoordinator.js';
import StaffCoordinator from '../models/StaffCoordinator.js';
import Event from '../models/Event.js';

export const getStudentCoordinators = async (req, res) => {
  try {
    const coordinators = await StudentCoordinator.find({});
    const detailed = await Promise.all(
      coordinators.map(async (coord) => {
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
    res.json(detailed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffCoordinators = async (req, res) => {
  try {
    const coordinators = await StaffCoordinator.find({});
    const detailed = await Promise.all(
      coordinators.map(async (coord) => {
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
    res.json(detailed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudentCoordinator = async (req, res) => {
  try {
    const id = req.params.id; // String ID mapping
    const { st_name, phone } = req.body;

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
