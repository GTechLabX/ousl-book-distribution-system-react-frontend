import { NavLink } from "react-router-dom";
import { useAuth } from "../../api/auth";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaWarehouse,
  FaUserPlus,
  FaBook,
  FaUsers,
  FaQrcode,
  FaCalendarCheck,
  FaListUl,
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  
  const userRole = user?.role?.toLowerCase();
  const uuid = user?.uuid; // This must exist in your Auth context

  const menuItems = [
    { name: "Dashboard", to: `/${uuid}/dashboard`, icon: <FaTachometerAlt />, roles: ["superadmin", "admin", "staff", "student"] },
    { name: "Scan Student", to: `/${uuid}/scan-student`, icon: <FaQrcode />, roles: ["superadmin", "admin", "staff"] },
    { name: "Distribution", to: `/${uuid}/distribution`, icon: <FaBoxOpen />, roles: ["superadmin", "admin"] },
    { name: "Inventory", to: `/${uuid}/inventory`, icon: <FaWarehouse />, roles: ["superadmin", "admin"] },
    { name: "Student Registration", to: `/${uuid}/registration`, icon: <FaUserPlus />, roles: ["superadmin", "admin"] },
    { name: "Course Management", to: `/${uuid}/course-management`, icon: <FaBook />, roles: ["superadmin", "admin"] },
    { name: "User Management", to: `/${uuid}/user-management`, icon: <FaUsers />, roles: ["superadmin", "admin"] },
    { name: "Make Reservation", to: `/${uuid}/book-reservation`, icon: <FaCalendarCheck />, roles: ["student"] },
    { name: "Center Allocation Book", to: `/${uuid}/view-center-allocation-book`, icon: <FaListUl />, roles: ["superadmin", "admin", "staff"] },
    { name: "View Reservations", to: `/${uuid}/view-book-reservation`, icon: <FaListUl />, roles: ["superadmin", "admin", "staff"] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

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
      <nav className="flex flex-col gap-2 px-3 py-6">
        {uuid && filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              <span className="text-lg">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))
        ) : (
          <p className="text-white text-xs px-4">
            {!uuid ? "Loading Session..." : `No access for role: ${userRole}`}
          </p>
        )}
      </nav>

      <div className="mt-auto py-4 text-center text-white/70 text-xs border-t border-white/20">
        © 2026 OUSL Dispatch
      </div>
    </aside>
  );
};

export default Sidebar;