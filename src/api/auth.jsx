// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user from localStorage on reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/login/", { username, password });
      const { access, refresh, role, uuid } = res.data;

      // Save tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Save user info
      const userData = { username, role, uuid };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return role;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
