// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md bg-transparent text-lg font-medium text-white transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <div className="h-full w-full bg-[#0c4187] border-r shadow-sm flex flex-col p-4 pt-10">
      
      <nav className="flex flex-col gap-2 ">
        <NavLink to="/dashboard" className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/distribution" className={linkClasses}>
          Distribution
        </NavLink>
        <NavLink to="/inventory" className={linkClasses}>
          Inventory
        </NavLink>
        <NavLink to="/registration" className={linkClasses}>
          Registration
        </NavLink>
        
      </nav>
    </div>
  );
};

export default Sidebar;