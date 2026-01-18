// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const res = await api.post("/login/", { username, password });

    const { access, refresh, role } = res.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    setUser({ username, role });
    return role;
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
