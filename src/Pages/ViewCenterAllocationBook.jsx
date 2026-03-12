import React, { useState, useEffect } from "react";
import { 
  FaSearch, FaBoxOpen, FaClock, FaExclamationTriangle, 
  FaTrashAlt, FaTimes, FaMapMarkerAlt, FaBook, FaCheckCircle
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function ViewCenterAllocation() {
  const { user: currentUser } = useAuth();
  
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

  // Statuses from your JSON are lowercase ("pending"), adjusted options to match
  const statusOptions = ["pending", "allocated", "dispatched", "received"];

  useEffect(() => {
    // Assuming you are passing center_id 1 based on your URL example
    fetchInitialData(1); 
  }, []);

  const fetchInitialData = async (centerId) => {
    setLoading(true);
    try {
      // Endpoint: http://127.0.0.1:8000/api/view-center-allocation/1/
      const res = await api.get(`/view-center-allocation/${centerId}/`, {
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
      // Update endpoint remains similar, check your backend for the exact route
      await api.put(`/book-allocation/update/${selectedAlloc.id}/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${currentUser?.access}` }}
      );
      setAllocations(prev => prev.map(item => 
        item.id === selectedAlloc.id ? { ...item, status: newStatus } : item
      ));
      setShowStatusModal(false);
    } catch (err) { alert("Status update failed."); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/book-allocation/delete/${selectedAlloc.id}/`, {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      setAllocations(prev => prev.filter(item => item.id !== selectedAlloc.id));
      setShowDeleteModal(false);
    } catch (err) { alert("Delete failed."); }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'allocated': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'dispatched': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'received': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
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
            <p className="text-slate-500 mt-1 font-medium italic">Tracking book inventory across regional centers</p>
          </div>
          <button onClick={() => fetchInitialData(1)} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm active:scale-95">
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
          <div className="relative">
            <select 
              className="w-full appearance-none bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none cursor-pointer shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map(opt => <option key={opt} value={opt.toUpperCase()}>{opt.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Center & ID</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Book & Quantity</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Date & Time</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="py-24 text-center text-slate-400 font-bold animate-pulse">Fetching Center Data...</td></tr>
                ) : filteredData.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <FaMapMarkerAlt size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs uppercase">{alloc.center}</p>
                          <p className="text-[10px] text-slate-400 font-bold font-mono">ALLOC-ID: #{alloc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <FaBook className="text-indigo-400" size={14}/> {alloc.book}
                        </p>
                        <span className="inline-flex items-center w-fit bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          Qty: {alloc.allocation_quantity}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <p className="text-[11px] font-bold text-slate-600">{alloc.date}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{alloc.time}</p>
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
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found for this center</p>
            </div>
          )}
        </div>
      </div>

      {/* MODALS (Status and Delete logic remains the same) */}
      {/* ... (Keep your existing modal code) ... */}
    </div>
  );
}

export default ViewCenterAllocation;