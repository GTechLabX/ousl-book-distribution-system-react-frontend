import React, { useState, useEffect } from "react";
import { FaUserPlus, FaUserEdit, FaUserSlash, FaSearch, FaUserShield, FaUsers, FaIdBadge, FaTimes, FaUserLock } from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/", {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      // Correctly accessing res.data.data based on your JSON
      setUsers(res.data.success ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPERADMIN': return { text: 'Superadmin', style: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'ADMIN2': return { text: 'AdminLevel2', style: 'bg-pink-100 text-pink-700 border-pink-200' };
      case 'STAFF': return { text: 'Staff', style: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'STUDENT': return { text: 'Student', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      default: return { text: role, style: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  // Logic adjusted for nested "custom_user" structure
  const filteredUsers = users.filter(u => 
    u.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.custom_user?.phone_no?.includes(searchQuery)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">User Administration</h1>
            <p className="text-gray-500 text-sm">Managing access for {users.length} registered accounts</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition shadow-lg active:scale-95">
            <FaUserPlus /> Register New User
          </button>
        </header>

        {/* Stats Section - Mapping to u.custom_user.role */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Superadmins', count: users.filter(u => u.custom_user?.role === 'SUPERADMIN').length, color: 'text-purple-600', bg: 'bg-purple-50', icon: <FaUserLock /> },
            { label: 'Level 2 Admins', count: users.filter(u => u.custom_user?.role === 'ADMIN2').length, color: 'text-pink-600', bg: 'bg-pink-50', icon: <FaUserShield /> },
            { label: 'Staff members', count: users.filter(u => u.custom_user?.role === 'STAFF').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: <FaIdBadge /> },
            { label: 'Students', count: users.filter(u => u.custom_user?.role === 'STUDENT').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <FaUsers /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-gray-800">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">User Identity</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Contact/Info</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">System Role</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Creation Date</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20 text-gray-400 italic">Syncing user directory...</td></tr>
              ) : filteredUsers.map((u) => {
                const badge = getRoleBadge(u.custom_user?.role);
                return (
                  <tr key={u.custom_user?.uuid} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${badge.style}`}>
                          {u.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 uppercase text-sm">{u.user?.username}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{u.custom_user?.uuid.split('-')[0]}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700 font-semibold">{u.custom_user?.phone_no || "No Contact"}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{u.custom_user?.gender || "Gender N/A"}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${badge.style}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                      {new Date(u.profile?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button className="text-indigo-600 p-2 hover:bg-indigo-100 rounded-lg transition-colors"><FaUserEdit size={16}/></button>
                        <button className="text-red-600 p-2 hover:bg-red-100 rounded-lg transition-colors"><FaUserSlash size={16}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersManagement;