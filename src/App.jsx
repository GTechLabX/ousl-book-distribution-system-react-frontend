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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No UUID needed here */}
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        {/* Protected Routes with Layout 
          We change path="/" to path="/:uuid" 
          This makes the URL look like: /d85a43.../distribution
        */}
        <Route path="/:uuid" element={<Layout />}>
          {/* Index route for when user hits just /uuid/ */}
          <Route index element={<Dashboard />} /> 
          
          <Route path="dashboard" element={<Dashboard />} />
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

        {/* Global Redirect: If someone hits "/" without a UUID, send to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 Handler */}
        <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;