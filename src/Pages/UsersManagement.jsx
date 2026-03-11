import React, { useState, useEffect } from "react";
import { 
  FaUserPlus, FaUserEdit, FaUserSlash, FaSearch, FaUserShield, 
  FaUsers, FaIdBadge, FaTimes, FaUserLock, FaEnvelope, 
  FaUser, FaLock, FaCheckCircle, FaSpinner, FaExclamationTriangle,
  FaMapMarkerAlt 
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [useUsernameAsPass, setUseUsernameAsPass] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "STAFF",
    center: "" 
  });

  const ROLES = [
    { value: "SUPERADMIN", label: "Superadmin", icon: <FaUserLock /> },
    { value: "ADMIN2", label: "AdminLevel2", icon: <FaUserShield /> },
    { value: "STAFF", label: "Staff", icon: <FaIdBadge /> },
    { value: "STUDENT", label: "Student", icon: <FaUsers /> },
  ];

  useEffect(() => { 
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchCenters()]);
      setLoading(false);
    };
    initData();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/", {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      setUsers(res.data.success ? res.data.data : []);
    } catch (err) { 
      console.error("Error fetching users:", err); 
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await api.get("/centers/");
      if (res.data.success) {
        setCenters(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching centers:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const openRegisterModal = () => {
    setIsEditMode(false);
    setSelectedUserId(null);
    setFormData({ username: "", email: "", password: "", role: "STAFF", center: "" });
    setUseUsernameAsPass(true);
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setIsEditMode(true);
    setSelectedUserId(u.user.id);
    setFormData({
      username: u.user.username || "",
      email: u.user.email || "",
      password: "", 
      role: u.custom_user?.role || "STAFF",
      center: u.profile?.center_id || u.custom_user?.center || "" 
    });
    setUseUsernameAsPass(false);
    setError(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // EXACT structure expected by your backend
    const payload = {
      user: {
        username: formData.username,
        email: formData.email,
        password: isEditMode 
          ? (formData.password || undefined) 
          : (useUsernameAsPass ? formData.username : formData.password)
      },
      custom_user: {
        role: formData.role
      },
      profile: {
        center_id: formData.center ? parseInt(formData.center) : null
      }
    };

    try {
      if (isEditMode) {
        await api.put(`/user/update/${selectedUserId}/`, payload);
      } else {
        // Updated to your specific endpoint
        await api.post("/user/add/", payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      // Handles the nested error structure from your backend
      if (err.response?.data?.errors) {
        const errs = err.response.data.errors;
        let messages = [];

        // Recursive function to find all error strings in nested objects
        const flatten = (obj) => {
          Object.values(obj).forEach(val => {
            if (Array.isArray(val)) messages.push(...val);
            else if (typeof val === 'object') flatten(val);
          });
        };
        flatten(errs);
        setError(messages.join(" | "));
      } else {
        setError(err.response?.data?.message || "Connection failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId === currentUser?.id) {
        alert("Security Override: You cannot terminate your own account.");
        setShowDeleteModal(false);
        return;
    }
    setSubmitting(true);
    try {
      await api.delete(`/user/delete/${selectedUserId}/`);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) { 
      setError("Deletion protocol failed."); 
    } finally { 
      setSubmitting(false); 
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

  const filteredUsers = users.filter(u => 
    u.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">User Administration</h1>
            <p className="text-gray-500 text-sm">Managing access for {users.length} registered accounts</p>
          </div>
          <button onClick={openRegisterModal} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition shadow-lg active:scale-95">
            <FaUserPlus /> Register New User
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {ROLES.map((role, i) => {
            const badge = getRoleBadge(role.value);
            return (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`${badge.style} p-3 rounded-lg`}>{role.icon}</div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{role.label}</p>
                  <p className="text-xl font-black text-gray-800">
                    {users.filter(u => u.custom_user?.role === role.value).length}
                  </p>
                </div>
              </div>
            );
          })}
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">User Identity</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Assigned Center</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">System Role</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-20 text-gray-400 italic">Syncing user directory...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-20 text-gray-400 italic">No users found.</td></tr>
              ) : filteredUsers.map((u) => {
                const badge = getRoleBadge(u.custom_user?.role);
                const centerId = u.profile?.center_id || u.custom_user?.center;
                const assignedCenter = centers.find(c => c.id === centerId);

                return (
                  <tr key={u.user?.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${badge.style}`}>
                          {u.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 uppercase text-sm">{u.user?.username}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{u.user?.email || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-indigo-400" size={12} />
                          <div>
                            <p className="text-sm text-gray-700 font-semibold">
                              {assignedCenter?.c_name || "Head Office"}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                              {/* Adjusted to look into profile or custom_user where phone numbers typically reside */}
                              Contact No: {u.profile?.phone_no || u.custom_user?.phone_no || "N/A"}
                            </p>
                          </div>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${badge.style}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(u)} className="text-indigo-600 p-2 hover:bg-indigo-100 rounded-lg transition-colors"><FaUserEdit /></button>
                        <button onClick={() => { setSelectedUserId(u.user.id); setShowDeleteModal(true); }} className="text-red-600 p-2 hover:bg-red-100 rounded-lg transition-colors"><FaUserSlash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`p-6 border-b border-gray-100 flex justify-between items-center text-white ${isEditMode ? 'bg-amber-500' : 'bg-indigo-600'}`}>
              <h2 className="text-xl font-bold">{isEditMode ? "Update Account" : "New Account"}</h2>
              <button onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* ERROR NOTIFICATION BOX */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-start gap-2 animate-pulse">
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input required name="username" value={formData.username} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Assigned Center</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <select 
                    required 
                    name="center" 
                    value={formData.center} 
                    onChange={handleInputChange} 
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select a Center</option>
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>{center.c_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Select System Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-[10px] font-bold transition-all ${
                        formData.role === role.value 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {role.icon} {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-3">
                {!isEditMode && (
                  <div onClick={() => setUseUsernameAsPass(!useUsernameAsPass)} className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${useUsernameAsPass ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200'}`}>
                      {useUsernameAsPass && <FaCheckCircle className="text-white text-[10px]" />}
                    </div>
                    <span className="text-xs font-bold text-gray-500 italic">Use username as temporary password</span>
                  </div>
                )}

                {(!useUsernameAsPass || isEditMode) && (
                  <div className="relative animate-in slide-in-from-top-2">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      required={!isEditMode && !useUsernameAsPass} 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-indigo-500 rounded-xl outline-none font-bold" 
                      placeholder={isEditMode ? "New Password (Optional)" : "Custom Password"}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className={`w-full py-4 text-white rounded-2xl font-black shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95 ${isEditMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  {submitting ? <FaSpinner className="animate-spin" /> : isEditMode ? "UPDATE CHANGES" : "REGISTER ACCOUNT"}
                </button>
              </div>   
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in duration-150">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle size={40} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-800 mb-1">Permanent Deletion</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              This action is <span className="text-red-600 font-bold">irreversible</span>. All data associated with this user will be purged from the system.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Keep Account
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                disabled={submitting} 
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : "DELETE FOREVER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;