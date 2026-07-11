import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import EventType from './models/EventType.js';
import Event from './models/Event.js';
import EventInfo from './models/EventInfo.js';
import Participant from './models/Participant.js';
import StudentCoordinator from './models/StudentCoordinator.js';
import StaffCoordinator from './models/StaffCoordinator.js';
import Admin from './models/Admin.js';
import ClubCoordinator from './models/ClubCoordinator.js';
import CoordinatorRequest from './models/CoordinatorRequest.js';

dotenv.config();

const eventTypes = [
  { type_id: 1, type_title: 'Technical Events' },
  { type_id: 2, type_title: 'Gaming Events' },
  { type_id: 3, type_title: 'On Stage Events' },
  { type_id: 4, type_title: 'Off Stage Events' }
];

const events = [
  { event_id: 'CH001', event_title: 'Cryptohunt', event_price: 100, participents: 0, img_link: 'images/crypto1.png', type_id: 1, description: 'Crack cryptographic puzzles, decode clues, and race against the clock in this thrilling scavenger hunt.' },
  { event_id: 'CH002', event_title: 'Search-it', event_price: 50, participents: 2, img_link: 'images/search_it.jpg', type_id: 1, description: 'Put your search engine skills to the test. Find answers to complex and hidden web queries faster than everyone else.' },
  { event_id: 'CH003', event_title: 'Technical-Quiz', event_price: 50, participents: 2, img_link: 'images/quiz.png', type_id: 1, description: 'Test your core concepts in computer science, coding trivia, networking, and technology trends.' },
  { event_id: 'CH004', event_title: 'Competitive-Coding', event_price: 50, participents: 1, img_link: 'images/coding.jpg', type_id: 1, description: 'Solve algorithmic challenges within time limits. Compete in writing optimized and bug-free code.' },
  { event_id: 'CH005', event_title: 'Pubg', event_price: 50, participents: 1, img_link: 'images/pubg.jpg', type_id: 2, description: 'Drop, loot, and battle it out in a highly competitive squad matchup to achieve victory.' },
  { event_id: 'CH006', event_title: 'Counter-Strike', event_price: 100, participents: 1, img_link: 'images/counter.jpg', type_id: 2, description: 'Classic tactical shooter showdown. Coordinate with your team to defuse the bomb or eliminate opponents.' },
  { event_id: 'CH007', event_title: 'Fashion-Show', event_price: 200, participents: 1, img_link: 'images/cs03.jpg', type_id: 3, description: 'Walk the ramp, showcase creative designs, and captivate the judges with your walk and style.' },
  { event_id: 'CH008', event_title: 'Dance', event_price: 100, participents: 0, img_link: 'images/dance.jpg', type_id: 3, description: 'Express yourself through movement. Show off solo performances or group choreography in any style.' },
  { event_id: 'CH009', event_title: 'Singing', event_price: 50, participents: 0, img_link: 'images/sing.jpg', type_id: 3, description: 'Take the mic and win hearts. Perform classical, semi-classical, pop, or fusion vocal tracks.' },
  { event_id: 'CH010', event_title: 'Svit-Idol', event_price: 100, participents: 0, img_link: 'images/idol.jpg', type_id: 3, description: 'The ultimate hunt for the best talent on campus. Show your best artistic performance to win the title.' },
  { event_id: 'CH011', event_title: 'Cooking-Without-Fire', event_price: 50, participents: 0, img_link: 'images/cook.jpg', type_id: 4, description: 'Prepare gourmet dishes using non-thermal methods. Impress with plating, taste, and creativity.' },
  { event_id: 'CH012', event_title: 'Short-Movie', event_price: 200, participents: 0, img_link: 'images/offstage.jpg', type_id: 4, description: 'Write, direct, and edit a short film based on given themes. Screening and evaluation by industry experts.' },
  { event_id: 'CH013', event_title: 'Mehandi', event_price: 100, participents: 0, img_link: 'images/mehandi.jpg', type_id: 4, description: 'Draw intricate, beautiful, and traditional patterns. Judged on design speed and clarity.' },
  { event_id: 'CH014', event_title: 'Rangoli', event_price: 50, participents: 0, img_link: 'images/rangoli.jpg', type_id: 4, description: 'Brighten up the quadrangle with colorful sands, petals, and patterns reflecting Indian culture.' }
];

const eventInfos = [
  { event_id: 'CH001', Date: '2026-11-16', time: '3.00pm', location: '135 Room' },
  { event_id: 'CH002', Date: '2026-11-16', time: '1.00pm', location: '020 Lab' },
  { event_id: 'CH003', Date: '2026-11-16', time: '11.00am', location: '136 Room' },
  { event_id: 'CH004', Date: '2026-11-16', time: '9.30am', location: '020 Lab' },
  { event_id: 'CH005', Date: '2026-10-17', time: '10.00am', location: '121 Lab' },
  { event_id: 'CH006', Date: '2026-10-17', time: '11.00am', location: '122 Lab' },
  { event_id: 'CH007', Date: '2026-10-17', time: '9.30pm', location: 'ON Stage' },
  { event_id: 'CH008', Date: '2026-10-17', time: '7.00pm', location: 'ON Stage' },
  { event_id: 'CH009', Date: '2026-10-17', time: '5.00pm', location: 'ON Stage' },
  { event_id: 'CH010', Date: '2026-10-17', time: '6.00pm', location: 'ON Stage' },
  { event_id: 'CH011', Date: '2026-10-16', time: '10.30am', location: '123 Room' },
  { event_id: 'CH012', Date: '2026-10-16', time: '10.00am', location: '021 Lab' },
  { event_id: 'CH013', Date: '2026-11-12', time: '3pm', location: '021 lab' },
  { event_id: 'CH014', Date: '2026-11-12', time: '2.00pm', location: 'Quadrangle' }
];

const participants = [
  { registration_id: 'CH-0001', registration_password: '1234', event_id: 'CH002', name: 'Anu', branch: 'CSE', sem: 5, email: 'annapoornaba@gmail.com', phone: '8123300011', college: 'Demo University', transactionId: 'TXN100001', paymentStatus: 'Verified' },
  { registration_id: 'CH-0002', registration_password: '1234', event_id: 'CH004', name: 'Bhavana G', branch: 'CSE', sem: 5, email: 'bhavanag@gmail.com', phone: '9934736623', college: 'Demo University', transactionId: 'TXN100002', paymentStatus: 'Pending' },
  { registration_id: 'CH-0003', registration_password: '1234', event_id: 'CH002', name: 'Prajwal Srinivas', branch: 'CSE', sem: 5, email: 'prajwal@gmail.com', phone: '9858787438', college: 'Demo University', transactionId: 'TXN100003', paymentStatus: 'Pending' },
  { registration_id: 'CH-0004', registration_password: '1234', event_id: 'CH003', name: 'Kavya', branch: 'CSE', sem: 5, email: 'kavya@gmail.com', phone: '7888387323', college: 'Demo University', transactionId: 'TXN100004', paymentStatus: 'Verified' },
  { registration_id: 'CH-0005', registration_password: '1234', event_id: 'CH003', name: 'Anu', branch: 'CSE', sem: 5, email: 'annapoornaba@gmail.com', phone: '8123300011', college: 'Demo University', transactionId: 'TXN100005', paymentStatus: 'Pending' },
  { registration_id: 'CH-0006', registration_password: '1234', event_id: 'CH003', name: 'Bhavana G', branch: 'CSE', sem: 5, email: 'bhavanag@gmail.com', phone: '9934736623', college: 'Demo University', transactionId: 'TXN100006', paymentStatus: 'Rejected' },
  { registration_id: 'CH-0007', registration_password: '1234', event_id: 'CH005', name: 'Bhavana G', branch: 'CSE', sem: 5, email: 'bhavanag@gmail.com', phone: '9934736623', college: 'Demo University', transactionId: 'TXN100007', paymentStatus: 'Pending' },
  { registration_id: 'CH-0008', registration_password: '1234', event_id: 'CH006', name: 'Anu', branch: 'CSE', sem: 5, email: 'annapoornaba@gmail.com', phone: '8123300011', college: 'Demo University', transactionId: 'TXN100008', paymentStatus: 'Pending' },
  { registration_id: 'CH-0009', registration_password: '1234', event_id: 'CH007', name: 'Prajwal Srinivas', branch: 'CSE', sem: 5, email: 'prajwal@gmail.com', phone: '9858787438', college: 'Demo University', transactionId: 'TXN100009', paymentStatus: 'Verified' }
];

const staffCoordinators = [
  { stid: 'CH001', name: 'Mamatha.s', phone: '9956436610', event_id: 'CH001' },
  { stid: 'CH002', name: 'Mamatha', phone: '9956436123', event_id: 'CH002' },
  { stid: 'CH003', name: 'Suparna.A', phone: '9956436456', event_id: 'CH003' },
  { stid: 'CH004', name: 'Geetha', phone: '9956436789', event_id: 'CH004' },
  { stid: 'CH005', name: 'Radha', phone: '9956436101', event_id: 'CH005' },
  { stid: 'CH006', name: 'Usha.D.R', phone: '9123436610', event_id: 'CH006' },
  { stid: 'CH007', name: 'Deeksha.G', phone: '9456436610', event_id: 'CH007' },
  { stid: 'CH008', name: 'Deeksha.Patgar', phone: '9789436610', event_id: 'CH008' },
  { stid: 'CH009', name: 'Shubha Naik', phone: '9956412310', event_id: 'CH009' },
  { stid: 'CH010', name: 'Sairaj Patgar', phone: '9956445610', event_id: 'CH010' },
  { stid: 'CH011', name: 'Reshma Hittalmakhi', phone: '9956473510', event_id: 'CH011' },
  { stid: 'CH012', name: 'Annanya.A.G', phone: '9955636610', event_id: 'CH012' },
  { stid: 'CH013', name: 'Sushma', phone: '8948476464', event_id: 'CH013' },
  { stid: 'CH014', name: 'Bhavya', phone: null, event_id: 'CH014' }
];

const studentCoordinators = [
  { sid: 'CH001', st_name: 'Prajwal Srinivas', phone: '6956436610', event_id: 'CH001' },
  { sid: 'CH002', st_name: 'Rakesh Mariyappa', phone: '7956436123', event_id: 'CH002' },
  { sid: 'CH003', st_name: 'Arjun.A', phone: '8956436456', event_id: 'CH003' },
  { sid: 'CH004', st_name: 'Sanjana', phone: '6956436789', event_id: 'CH004' },
  { sid: 'CH005', st_name: 'NIkhil Bhat', phone: '7956436101', event_id: 'CH005' },
  { sid: 'CH006', st_name: 'Pruthvi P', phone: '8123436610', event_id: 'CH006' },
  { sid: 'CH007', st_name: 'Anshuman.A.N', phone: '6456436610', event_id: 'CH007' },
  { sid: 'CH008', st_name: 'Abhinandhan.A', phone: '7789436610', event_id: 'CH008' },
  { sid: 'CH009', st_name: 'Suraj Upadhya', phone: '7956412310', event_id: 'CH009' },
  { sid: 'CH010', st_name: 'Imran Khalil Khan', phone: '7956445610', event_id: 'CH010' },
  { sid: 'CH011', st_name: 'Mythri', phone: '6956473510', event_id: 'CH011' },
  { sid: 'CH012', st_name: 'Pratyush Mishra', phone: '8955636610', event_id: 'CH012' },
  { sid: 'CH013', st_name: 'Kavya', phone: '8994874384', event_id: 'CH013' },
  { sid: 'CH014', st_name: 'Rishitha', phone: null, event_id: 'CH014' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database...');

    // Drop database to clear old collection structures
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped and cleared.');

    // Insert Admin
    await Admin.create({
      email: 'admin@campushub.com',
      password: bcrypt.hashSync('admin123', 10)
    });
    console.log('Admin credentials seeded (admin@campushub.com / admin123).');

    // Hash sample coordinator password
    const hash = bcrypt.hashSync('coordinator123', 10);
    await ClubCoordinator.create({
      name: 'Himanshu Negi',
      email: 'coordinator@campushub.com',
      phone: '9876543210',
      clubName: 'Coding Club',
      department: 'CSE',
      description: 'CampusHub Club Coordinator Lead',
      password: hash,
      status: 'Active',
      role: 'student_coordinator'
    });

    await ClubCoordinator.create({
      name: 'Dr. Staff Mentor',
      email: 'staff_coord@campushub.com',
      phone: '9876543222',
      clubName: 'IEEE Student Branch',
      department: 'ISE',
      description: 'Faculty Club Coordinator',
      password: hash,
      status: 'Active',
      role: 'staff_coordinator'
    });
    console.log('Coordinators seeded (coordinator@campushub.com / staff_coord@campushub.com).');

    // Insert event data
    await EventType.insertMany(eventTypes);
    await Event.insertMany(events);
    await EventInfo.insertMany(eventInfos);
    await Participant.insertMany(participants);
    await StaffCoordinator.insertMany(staffCoordinators);
    await StudentCoordinator.insertMany(studentCoordinators);

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
