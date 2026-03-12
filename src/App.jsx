import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Dashboard from './Pages/Dashboard';
import Distribution from './Pages/Distribution';
import Inventory from './Pages/Inventory';
import Registration from './Pages/Registration';
import UsersManagement from './Pages/UsersManagement';
import CourseManagement from './Pages/CourseManagement';
import Login from './Pages/Login'; 
import PasswordReset from './Pages/passwordReset';
import ScanStudent from './Pages/ScanStudent';
import BookReservation from './Pages/BookReservation';
import ViewBookReservation from './Pages/ViewBookReservation';
import Enrollment from './Pages/Enrollment';
import ViewCenterAllocation from './Pages/ViewCenterAllocationBook';
import StudentDashboard from './Pages/StudentDashboard';
import { useAuth } from "./api/auth";

// Smart Component to decide which dashboard to show at the index path
const DashboardHome = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  if (role === 'student') {
    return <StudentDashboard />;
  }
  return <Dashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        {/* Protected Routes with Layout */}
        <Route path="/:uuid" element={<Layout />}>
          {/* Index route handles automatic steering */}
          <Route index element={<DashboardHome />} /> 
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="scan-student" element={<ScanStudent />} />
          <Route path="distribution" element={<Distribution />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="registration" element={<Registration />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="user-management" element={<UsersManagement />} />
          <Route path="book-reservation" element={<BookReservation />} />
          <Route path="view-book-reservation" element={<ViewBookReservation />} />
          <Route path="view-center-allocation-book" element={<ViewCenterAllocation />} />
          <Route path="enrollment/:id" element={<Enrollment />} />
        </Route>

        {/* Global Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 Handler */}
        <Route path="*" element={<div className="p-10 text-center text-gray-500 font-bold">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;