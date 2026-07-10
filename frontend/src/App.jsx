import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import RegisterStudent from './pages/RegisterStudent';
import RegistrationSuccess from './pages/RegistrationSuccess';
import RegisteredEvent from './pages/RegisteredEvent';
import BecomeCoordinator from './pages/BecomeCoordinator';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CoordinatorRequestsList from './pages/CoordinatorRequestsList';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import CoordinatorProfile from './pages/CoordinatorProfile';
import StudentDetailsList from './pages/StudentDetailsList';
import StudentCoordinatorsList from './pages/StudentCoordinatorsList';
import StaffCoordinatorsList from './pages/StaffCoordinatorsList';
import UpdateStudentCoordinator from './pages/UpdateStudentCoordinator';
import UpdateStaffCoordinator from './pages/UpdateStaffCoordinator';
import CreateEvent from './pages/CreateEvent';
import AdminEventDetails from './pages/AdminEventDetails';
import UpdateEvent from './pages/UpdateEvent';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminSettings from './pages/AdminSettings';
import PaymentVerification from './pages/PaymentVerification';
import ProtectedRoute from './components/ProtectedRoute';

// Redirection helper for viewEvent.php?id=<id> -> /events/type/:typeId
const NavigateToEventsList = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  return <Navigate to={`/events/type/${id || 1}`} replace />;
};

// Redirection helper for updateStudent.php?id=<id> -> /admin/coordinators/student/update?id=<id>
const NavigateToUpdateStudent = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  return <Navigate to={`/admin/coordinators/student/update?id=${id}`} replace />;
};

// Redirection helper for updateStaff.php?id=<id> -> /admin/coordinators/staff/update?id=<id>
const NavigateToUpdateStaff = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  return <Navigate to={`/admin/coordinators/staff/update?id=${id}`} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Visitor/Student pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/events/type/:typeId" element={<EventsList />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/register/:eventId" element={<RegisterStudent />} />
        <Route path="/success/:regId" element={<RegistrationSuccess />} />
        <Route path="/registered-event" element={<RegisteredEvent />} />
        <Route path="/become-coordinator" element={<BecomeCoordinator />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Public Portal Login route (unified login for Admin & Coordinator) */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Portal routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['admin']}><CoordinatorRequestsList /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><StudentDetailsList /></ProtectedRoute>} />
        <Route path="/admin/coordinators/student" element={<ProtectedRoute allowedRoles={['admin']}><StudentCoordinatorsList /></ProtectedRoute>} />
        <Route path="/admin/coordinators/staff" element={<ProtectedRoute allowedRoles={['admin']}><StaffCoordinatorsList /></ProtectedRoute>} />
        <Route path="/admin/coordinators/student/update" element={<ProtectedRoute allowedRoles={['admin']}><UpdateStudentCoordinator /></ProtectedRoute>} />
        <Route path="/admin/coordinators/staff/update" element={<ProtectedRoute allowedRoles={['admin']}><UpdateStaffCoordinator /></ProtectedRoute>} />
        <Route path="/admin/events/create" element={<ProtectedRoute allowedRoles={['admin']}><CreateEvent /></ProtectedRoute>} />
        <Route path="/admin/events/:eventId" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventDetails /></ProtectedRoute>} />
        <Route path="/admin/events/update/:eventId" element={<ProtectedRoute allowedRoles={['admin']}><UpdateEvent /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><PaymentVerification /></ProtectedRoute>} />

        {/* Protected Club Coordinator Portal routes */}
        <Route path="/coordinator/dashboard" element={<ProtectedRoute allowedRoles={['coordinator']}><CoordinatorDashboard /></ProtectedRoute>} />
        <Route path="/coordinator/profile" element={<ProtectedRoute allowedRoles={['coordinator']}><CoordinatorProfile /></ProtectedRoute>} />
        <Route path="/coordinator/students" element={<ProtectedRoute allowedRoles={['coordinator']}><StudentDetailsList /></ProtectedRoute>} />
        <Route path="/coordinator/payments" element={<ProtectedRoute allowedRoles={['coordinator']}><PaymentVerification /></ProtectedRoute>} />
        <Route path="/coordinator/events/create" element={<ProtectedRoute allowedRoles={['coordinator']}><CreateEvent /></ProtectedRoute>} />
        <Route path="/coordinator/events/:eventId" element={<ProtectedRoute allowedRoles={['coordinator']}><AdminEventDetails /></ProtectedRoute>} />
        <Route path="/coordinator/events/update/:eventId" element={<ProtectedRoute allowedRoles={['coordinator']}><UpdateEvent /></ProtectedRoute>} />

        {/* Legacy PHP Route Redirections for Compatibility */}
        <Route path="/index.php" element={<Navigate to="/" replace />} />
        <Route path="/viewEvent.php" element={<NavigateToEventsList />} />
        <Route path="/register.php" element={<Navigate to="/" replace />} />
        <Route path="/aboutus.php" element={<Navigate to="/about" replace />} />
        <Route path="/contact.php" element={<Navigate to="/contact" replace />} />
        <Route path="/login_form.php" element={<Navigate to="/login" replace />} />
        <Route path="/adminPage.php" element={<Navigate to="/admin" replace />} />
        <Route path="/Stu_details.php" element={<Navigate to="/admin/students" replace />} />
        <Route path="/Stu_cordinator.php" element={<Navigate to="/admin/coordinators/student" replace />} />
        <Route path="/stu_cordinator.php" element={<Navigate to="/admin/coordinators/student" replace />} />
        <Route path="/Staff_cordinator.php" element={<Navigate to="/admin/coordinators/staff" replace />} />
        <Route path="/updateStudent.php" element={<NavigateToUpdateStudent />} />
        <Route path="/updateStaff.php" element={<NavigateToUpdateStaff />} />
        <Route path="/createEventForm.php" element={<Navigate to="/admin/events/create" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
