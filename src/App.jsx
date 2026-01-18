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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login route */}
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        {/* All routes inside Layout */}
        <Route path="/" element={<Layout />} >
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="distribution" element={<Distribution />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="registration" element={<Registration />} />
          <Route path="Course Management" element={<CourseManagement />} />
          <Route path="User Management" element={<UsersManagement />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
