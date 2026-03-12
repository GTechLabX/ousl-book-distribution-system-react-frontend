import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../api/auth";

function Footer() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming your auth context has a logout function

  const handleLogout = async () => {
    try {
      // 1. Call the backend logout API
      await api.post("/logout/"); 
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      // 2. Clear local auth state/tokens regardless of API success
      logout(); 
      
      // 3. Redirect to login page
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="px-4 py-4 border-t border-white/20 text-center">
      <button
        onClick={handleLogout}
        className="w-full bg-white text-[#0c4187] py-2 rounded-lg
                   font-semibold hover:bg-gray-200 transition shadow"
      >
        Log Out
      </button>

      <p className="text-white/70 text-xs mt-3">Version 1.0</p>
    </div>
  );
}

export default Footer;