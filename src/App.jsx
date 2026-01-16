import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Dashboard from './Pages/Dashboard';
import Distribution from './Pages/Distribution';
import Inventory from './Pages/Inventory';
import Registration from './Pages/Registration';
import UsersManagement from './Pages/UsersManagement';
import CourseManagement from './Pages/CourseManagement';




function App() {


  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Layout />} >

          {/* <Route index element={<h1>Home Page</h1>} /> */}
         
          <Route index path="dashboard" element={<Dashboard />} />

          <Route path="distribution" element={<Distribution />} />

          <Route path="inventory" element={<Inventory />} />

          <Route path="registration" element={<Registration />} />


        </Route>
      </Routes>
      
    </BrowserRouter>

    // <Login/>
=======
       <Route path="/" element={<Layout />} >

          {/* <Route index element={<h1>Home Page</h1>} /> */}
         
         <Route index path="dashboard" element={<Dashboard />} />

          <Route path="distribution" element={<Distribution />} />
          
          <Route path="inventory" element={<Inventory />} />

         <Route path="registration" element={<Registration />} />

         <Route path="Course Management" element={<CourseManagement />} />
            
          <Route path="User Management" element={<UsersManagement />} />
          




        </Route>
       </Routes>
      
     </BrowserRouter>

   
>>>>>>> f5882d738c458d22166b8a4d6d25593610993d3c
  );
}

export default App;