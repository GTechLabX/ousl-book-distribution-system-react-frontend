import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Side Panel/Header";
import Menu from "../Side Panel/Menu";
import Footer from "../Side Panel/Footer";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* Top Header */}
      <Header username="Admin User" role="Administrator" />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-[#0c4187] to-[#070055] flex flex-col shadow-xl">
          <Menu />
          <Footer />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default Layout;
