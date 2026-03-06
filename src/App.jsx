import { Routes, Route, BrowserRouter } from 'react-router-dom';
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


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        {/* All routes inside Layout */}
        <Route path="/" element={<Layout />} >
          <Route index element={<Dashboard />} /> {/* default route "/" */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scan-student" element={<ScanStudent />} />
          <Route path="distribution" element={<Distribution />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="registration" element={<Registration />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="user-management" element={<UsersManagement />} />
          <Route path="book-reservation" element={<BookReservation />} />
          <Route path="view-book-reservation" element={<ViewBookReservation />} />
          <Route path="/enrollment/:id" element={<Enrollment />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
