import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../api/auth"; // import the context

function Header({ avatarUrl }) {
  const { user } = useAuth(); // get the logged-in user

  return (
    <header
      className="
        w-full h-18
        bg-gradient-to-r from-[#0c4187] to-[#070055]
        flex items-center justify-between
        px-6 py-3 shadow-md
      "
    >
      {/* Left: Logo + Titles */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow">
          <img
            src="/src/assets/logoOusl.png"
            alt="OUSL Logo"
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Text */}
        <div className="leading-tight">
          <h1 className="text-white font-bold text-lg tracking-wide">
            OUSL Dispatch
          </h1>
          <p className="text-white/70 text-xs tracking-wide">
            Administration Panel
          </p>
        </div>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-3 bg-white/95 px-3 py-1.5 rounded-xl shadow-sm">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="text-gray-400 text-3xl" />
        )}

        <div className="leading-tight text-right">
          <p className="text-sm font-semibold text-[#0c4187]">
            {user?.username || "User"} {/* show username from context */}
          </p>
          <p className="text-xs text-gray-500">
            {user?.role || "Student"} {/* show role from context */}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
