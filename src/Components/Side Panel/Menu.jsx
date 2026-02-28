import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaWarehouse,
  FaUserPlus,
  FaBook,
  FaUsers,
  FaQrcode, // icon for scan student
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", to: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Scan Student", to: "/scan-student", icon: <FaQrcode /> }, // <--- Added
    { name: "Distribution", to: "/distribution", icon: <FaBoxOpen /> },
    { name: "Inventory", to: "/inventory", icon: <FaWarehouse /> },
    { name: "Student Registration", to: "/registration", icon: <FaUserPlus /> },
    { name: "Course Management", to: "/course-management", icon: <FaBook /> },
    { name: "User Management", to: "/user-management", icon: <FaUsers /> },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl 
     transition-all duration-300 ease-in-out
     text-base font-medium
     ${
       isActive
         ? "bg-white text-[#0c4187] shadow-md"
         : "text-white hover:bg-white/90 hover:text-[#0c4187]"
     }`;

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gradient-to-b from-[#0c4187] to-[#070055] shadow-xl">
      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-3 py-6">
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClasses}>
            <span className="text-lg">{item.icon}</span>
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto py-4 text-center text-white/70 text-xs border-t border-white/20">
        © 2026 OUSL Dispatch
      </div>
    </aside>
  );
};

export default Sidebar;
