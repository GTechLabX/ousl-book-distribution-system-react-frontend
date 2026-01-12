import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Dashboard from './Pages/Dashboard';
import Distribution from './Pages/Distribution';
import Inventory from './Pages/Inventory';
import Registration from './Pages/Registration';
import StudentRegistation from './Pages/StudentRegistation';
import CourseManagement from './Pages/CourseManagement.jsx';
//import Registration from './Pages/Login';



function App() {


  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Layout />} >

          {/* <Route index element={<h1>Home Page</h1>} /> */}
         
         <Route index path="dashboard" element={<Dashboard />} />

          <Route path="distribution" element={<Distribution />} />

          <Route path="inventory" element={<Inventory />} />

         <Route path="registration" element={<Registration />} />

         <Route path="CourseManagement" element={<CourseManagement />} />
            
          <Route path="StudentRegistation" element={<StudentRegistation />} />
          




        </Route>
       </Routes>
      
     </BrowserRouter>

   
  );
}

export default App;