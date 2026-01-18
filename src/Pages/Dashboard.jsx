// src/Pages/Dashboard.jsx
import React from "react";
import { FaUsers, FaBoxOpen, FaWarehouse, FaClipboardList } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center gap-4">
            <FaUsers className="text-3xl text-[#0c4187]" />
            <div>
              <p className="text-gray-500 text-sm">Users</p>
              <p className="text-2xl font-bold">245</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center gap-4">
            <FaBoxOpen className="text-3xl text-[#0c4187]" />
            <div>
              <p className="text-gray-500 text-sm">Distributions</p>
              <p className="text-2xl font-bold">152</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center gap-4">
            <FaWarehouse className="text-3xl text-[#0c4187]" />
            <div>
              <p className="text-gray-500 text-sm">Inventory</p>
              <p className="text-2xl font-bold">68</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center gap-4">
            <FaClipboardList className="text-3xl text-[#0c4187]" />
            <div>
              <p className="text-gray-500 text-sm">Pending Tasks</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#0c4187] text-white py-2 px-4 rounded-lg shadow hover:bg-[#070055] transition duration-300">
            Add User
          </button>
          <button className="bg-[#0c4187] text-white py-2 px-4 rounded-lg shadow hover:bg-[#070055] transition duration-300">
            Add Distribution
          </button>
          <button className="bg-[#0c4187] text-white py-2 px-4 rounded-lg shadow hover:bg-[#070055] transition duration-300">
            Add Inventory
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-gray-600 font-medium">Date</th>
              <th className="py-2 px-4 text-left text-gray-600 font-medium">User</th>
              <th className="py-2 px-4 text-left text-gray-600 font-medium">Action</th>
              <th className="py-2 px-4 text-left text-gray-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50 transition duration-200">
              <td className="py-2 px-4">2026-01-14</td>
              <td className="py-2 px-4">John Doe</td>
              <td className="py-2 px-4">Added new user</td>
              <td className="py-2 px-4 text-green-600 font-semibold">Success</td>
            </tr>
            <tr className="border-b hover:bg-gray-50 transition duration-200">
              <td className="py-2 px-4">2026-01-13</td>
              <td className="py-2 px-4">Jane Smith</td>
              <td className="py-2 px-4">Updated inventory</td>
              <td className="py-2 px-4 text-yellow-600 font-semibold">Pending</td>
            </tr>
            <tr className="border-b hover:bg-gray-50 transition duration-200">
              <td className="py-2 px-4">2026-01-12</td>
              <td className="py-2 px-4">Admin22</td>
              <td className="py-2 px-4">Deleted distribution</td>
              <td className="py-2 px-4 text-red-600 font-semibold">Failed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
