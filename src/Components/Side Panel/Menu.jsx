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
  FaAddressBook
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  
  const userRole = user?.role?.toLowerCase();
  const uuid = user?.uuid; 

  // Dashboard path logic: students go to student-dashboard, others to normal dashboard
  const dashboardPath = userRole === "student" ? `/${uuid}/student-dashboard` : `/${uuid}/dashboard`;

  const menuItems = [
    { 
      name: "Dashboard", 
      to: dashboardPath, 
      icon: <FaTachometerAlt />, 
      roles: ["superadmin", "admin", "staff", "student"] 
    },
    { name: "Scan Student", to: `/${uuid}/scan-student`, icon: <FaQrcode />, roles: ["superadmin", "admin", "staff"] },
    { name: "Center Distribution", to: `/${uuid}/distribution`, icon: <FaBoxOpen />, roles: ["superadmin", "admin"] },
    { name: "Book Stocks", to: `/${uuid}/inventory`, icon: <FaWarehouse />, roles: ["superadmin", "admin"] },
    { name: "Student Registration", to: `/${uuid}/registration`, icon: <FaUserPlus />, roles: ["superadmin", "admin"] },
    { name: "Course Management", to: `/${uuid}/course-management`, icon: <FaBook />, roles: ["superadmin", "admin"] },
    { name: "User Management", to: `/${uuid}/user-management`, icon: <FaUsers />, roles: ["superadmin", "admin"] },
    { name: "Make Reservation", to: `/${uuid}/book-reservation`, icon: <FaCalendarCheck />, roles: ["student"] },
    { name: "Center Allocation Book", to: `/${uuid}/view-center-allocation-book`, icon: <FaAddressBook />, roles: ["admin", "staff"] },
    { name: "View Reservations", to: `/${uuid}/view-book-reservation`, icon: <FaListUl />, roles: ["superadmin", "admin", "staff"] },
  ];

  // Filter based on role
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


      <nav className="flex flex-col gap-2 px-3 py-2">
        {uuid && filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              <span className="text-lg">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-white/50 text-xs px-4">
              {!uuid ? "Syncing session..." : `Unauthorized Access`}
            </p>
          </div>
        )}
      </nav>

      <div className="mt-auto py-4 text-center text-white/50 text-[10px] border-t border-white/10 uppercase tracking-widest">
        © 2026 OUSL Regional Systems
      </div>
    </aside>
  );
};

export default Sidebar;