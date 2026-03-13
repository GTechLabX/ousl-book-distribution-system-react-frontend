import React, { useState, useEffect, useCallback } from "react";
import { 
  FaSearch, FaCalendarCheck, FaClock, FaExclamationTriangle, 
  FaUserCircle, FaTrashAlt, FaIdCard 
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function ViewBookReservation() {
  const { user: currentUser } = useAuth();
  
  // Data States
  const [reservations, setReservations] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRes, setSelectedRes] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const statusOptions = ["PENDING", "APPROVED", "COLLECTED", "EXPIRED"];

  // Use the UUID from context or the fallback you provided
  const uuid = currentUser?.regional_center_id || "840ce1cc-c8b0-4346-a4bf-049b8fbc9454";

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/get-reservation-base-on-center/${uuid}/`, {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      
      if (res.data && res.data.success) {
        setReservations(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, uuid]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Updated to handle status update specifically
  const handleUpdateStatus = async (newStatus) => {
    try {
      // API call to update ONLY the status
      const response = await api.put(`/book-reservation/update/${selectedRes.id}/`, 
        { status: newStatus.toUpperCase() }, // Backend usually expects uppercase for choices
        { headers: { Authorization: `Bearer ${currentUser?.access}` }}
      );

      if (response.data.success) {
        // IMPORTANT: We update ONLY the status in state. 
        // We keep the existing 'student' and 'book' strings from the current state
        setReservations(prev => prev.map(item => 
          item.id === selectedRes.id 
            ? { ...item, status: newStatus.toUpperCase() } 
            : item
        ));
        setShowStatusModal(false);
      }
    } catch (err) { 
      console.error("Update failed:", err);
      alert("Status update failed."); 
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/book-reservation/delete/${selectedRes.id}/`, {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      setReservations(prev => prev.filter(item => item.id !== selectedRes.id));
      setShowDeleteModal(false);
    } catch (err) { alert("Delete failed."); }
  };

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'APPROVED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'COLLECTED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'EXPIRED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredData = reservations.filter(res => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (res.student?.toString().toLowerCase() || "").includes(query) || 
      (res.student_reg_no?.toLowerCase() || "").includes(query) ||
      (res.book?.toString().toLowerCase() || "").includes(query);

    const matchesStatus = statusFilter === "ALL" || res.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FaCalendarCheck className="text-indigo-600" /> Reservations
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">
              Regional Management Console
            </p>
          </div>
          <button onClick={fetchInitialData} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition active:scale-95">
            Refresh Data
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by student, registration, or book..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Book Details</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <FaUserCircle size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 uppercase text-xs">
                            {res.student}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1">
                            <FaIdCard className="opacity-40" /> {res.student_reg_no}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-bold text-slate-700">{res.book}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                          <FaClock className="text-slate-300" /> Pickup: {res.expected_pickup_date}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <button 
                        onClick={() => { setSelectedRes(res); setShowStatusModal(true); }}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest shadow-sm transition-all active:scale-95 ${getStatusStyle(res.status)}`}
                      >
                        {res.status}
                      </button>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button 
                        onClick={() => { setSelectedRes(res); setShowDeleteModal(true); }}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && <div className="py-20 text-center text-slate-400 font-black animate-pulse uppercase text-xs tracking-[0.2em]">Synchronizing...</div>}
          {!loading && filteredData.length === 0 && (
            <div className="py-20 text-center">
               <FaExclamationTriangle className="mx-auto text-slate-100 mb-4" size={48} />
               <p className="text-slate-400 font-bold uppercase text-xs">No records available</p>
            </div>
          )}
        </div>
      </div>

      {/* STATUS MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 uppercase mb-8 text-center">Update Status</h3>
            <div className="flex flex-col gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className={`py-4 px-6 rounded-2xl border font-black text-xs uppercase transition-all ${getStatusStyle(status)} hover:brightness-95`}
                >
                  {status}
                </button>
              ))}
              <button onClick={() => setShowStatusModal(false)} className="mt-4 text-slate-400 font-bold text-xs uppercase hover:text-slate-600 transition">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Confirm Delete?</h3>
            <p className="text-slate-500 text-sm mt-3 mb-10 leading-relaxed">This will remove the reservation for <b>{selectedRes?.student}</b> permanently.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBookReservation;