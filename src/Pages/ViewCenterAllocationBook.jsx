import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  FaSearch, FaBoxOpen, FaExclamationTriangle, 
  FaTrashAlt, FaTimes, FaMapMarkerAlt, FaBook, FaCheckCircle
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function ViewCenterAllocation() {
  const { user: currentUser } = useAuth();
  const { uuid } = useParams(); // Retrieves UUID from URL (e.g., /:uuid/view-center-allocation-book)
  
  // Data States
  const [allocations, setAllocations] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Popup States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAlloc, setSelectedAlloc] = useState(null);

  // Matches Django Model STATUS_CHOICES
  const statusOptions = ["pending", "approved", "rejected"];

  useEffect(() => {
    if (uuid) {
      fetchInitialData(uuid); 
    }
  }, [uuid]);

  const fetchInitialData = async (centerUuid) => {
    setLoading(true);
    try {
      // Endpoint: http://127.0.0.1:8000/api/view-center-allocation/<uuid>/
      const res = await api.get(`/view-center-allocation/${centerUuid}/`, {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      
      if (res.data.success) {
        setAllocations(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching allocations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      // Automatically set 'approved' boolean based on status string
      const isApproved = newStatus.toLowerCase() === "approved";

      // Endpoint: http://127.0.0.1:8000/api/center-book/update/<id>/
      await api.put(`/center-book/update/${selectedAlloc.id}/`, 
        { 
          status: newStatus,
          approved: isApproved 
        },
        { headers: { Authorization: `Bearer ${currentUser?.access}` }}
      );

      // Refresh local UI state
      setAllocations(prev => prev.map(item => 
        item.id === selectedAlloc.id 
          ? { ...item, status: newStatus, approved: isApproved } 
          : item
      ));
      setShowStatusModal(false);
    } catch (err) { 
      alert("Status update failed."); 
    }
  };

  const handleDelete = async () => {
    try {
      // Endpoint: http://127.0.0.1:8000/api/center-book/delete/<id>/
      await api.delete(`/center-book/delete/${selectedAlloc.id}/`, {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });

      // Remove from UI state
      setAllocations(prev => prev.filter(item => item.id !== selectedAlloc.id));
      setShowDeleteModal(false);
      setSelectedAlloc(null);
    } catch (err) { 
      alert("Delete failed."); 
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredData = allocations.filter(alloc => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      alloc.book.toLowerCase().includes(query) || 
      alloc.center.toLowerCase().includes(query) ||
      alloc.id.toString().includes(query);
    return matchesSearch && (statusFilter === "ALL" || alloc.status.toUpperCase() === statusFilter);
  });

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FaBoxOpen className="text-indigo-600" /> Center Allocation
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">Tracking book inventory for Center UUID: {uuid}</p>
          </div>
          <button 
            onClick={() => fetchInitialData(uuid)} 
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            Refresh Data
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by book name, center, or ID..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none cursor-pointer shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            {statusOptions.map(opt => <option key={opt} value={opt.toUpperCase()}>{opt.toUpperCase()}</option>)}
          </select>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Center & ID</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Book & Quantity</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="py-24 text-center text-slate-400 font-bold animate-pulse">Fetching Center Data...</td></tr>
                ) : filteredData.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <FaMapMarkerAlt size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs uppercase">{alloc.center}</p>
                          <p className="text-[10px] text-slate-400 font-bold font-mono">ID: #{alloc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          {alloc.book} {alloc.approved && <FaCheckCircle className="text-emerald-500" />}
                        </p>
                        <span className="text-[10px] font-black text-indigo-600 uppercase">Qty: {alloc.allocation_quantity}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <button 
                        onClick={() => { setSelectedAlloc(alloc); setShowStatusModal(true); }}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest transition-all shadow-sm ${getStatusStyle(alloc.status)}`}
                      >
                        {alloc.status}
                      </button>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button 
                        onClick={() => { setSelectedAlloc(alloc); setShowDeleteModal(true); }}
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
          {!loading && filteredData.length === 0 && (
            <div className="py-24 text-center">
              <FaExclamationTriangle className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-6">Update Status</h3>
            <div className="flex flex-col gap-3">
              {statusOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleUpdateStatus(option)}
                  className="w-full py-4 rounded-2xl font-bold uppercase text-sm border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
            <button onClick={() => setShowStatusModal(false)} className="w-full mt-6 text-slate-400 font-bold text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTrashAlt size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Delete Record?</h3>
            <p className="text-slate-500 text-sm mb-8">This will permanently remove allocation #{selectedAlloc?.id} from the database.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 rounded-2xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCenterAllocation;