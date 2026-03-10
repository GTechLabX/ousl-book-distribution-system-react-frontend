import React, { useState, useEffect } from "react";
import { 
  FaSearch, FaCalendarCheck, FaClock, FaExclamationTriangle, 
  FaFilter, FaUserCircle, FaBookOpen, FaTrashAlt, FaTimes, FaIdCard, FaCode 
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function ViewBookReservation() {
  const { user: currentUser } = useAuth();
  
  // Data States
  const [reservations, setReservations] = useState([]);
  const [studentDetails, setStudentDetails] = useState({});
  const [bookDetails, setBookDetails] = useState({});
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Popup States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);

  const statusOptions = ["PENDING", "APPROVED", "COLLECTED", "EXPIRED"];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/book-reservations/", {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      
      if (res.data.success) {
        const data = res.data.data;
        setReservations(data);
        fetchRelatedMetadata(data);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMetadata = async (data) => {
    const studentIds = [...new Set(data.map(item => item.student))];
    const bookIds = [...new Set(data.map(item => item.book))];

    // Fetch Student Info
    studentIds.forEach(async (id) => {
      try {
        const res = await api.get(`/student/${id}/`);
        if (res.data.success) {
          setStudentDetails(prev => ({ 
            ...prev, 
            [id]: { 
              name: res.data.message.student_name, 
              reg: res.data.message.reg_no 
            } 
          }));
        }
      } catch (err) { console.error(`Student ${id} fetch error`); }
    });

    // Fetch Book Info + Course Code
    bookIds.forEach(async (id) => {
      try {
        const res = await api.get(`/center-book/${id}/`);
        if (res.data.success) {
          setBookDetails(prev => ({ 
            ...prev, 
            [id]: { 
              name: res.data.data.book_name,
              code: res.data.course_code 
            } 
          }));
        }
      } catch (err) { console.error(`Book ${id} fetch error`); }
    });
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/book-reservation/update/${selectedRes.id}/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${currentUser?.access}` }}
      );
      setReservations(prev => prev.map(item => 
        item.id === selectedRes.id ? { ...item, status: newStatus } : item
      ));
      setShowStatusModal(false);
    } catch (err) { alert("Status update failed."); }
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
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'APPROVED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'COLLECTED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'EXPIRED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredData = reservations.filter(res => {
    const sInfo = studentDetails[res.student];
    const bInfo = bookDetails[res.book];
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      sInfo?.name?.toLowerCase().includes(query) || 
      sInfo?.reg?.toLowerCase().includes(query) ||
      bInfo?.name?.toLowerCase().includes(query) ||
      bInfo?.code?.toLowerCase().includes(query) ||
      res.id.toString().includes(query);
    return matchesSearch && (statusFilter === "ALL" || res.status === statusFilter);
  });

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FaCalendarCheck className="text-indigo-600" /> Book Registry
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">Track and manage student book reservations</p>
          </div>
          <button onClick={fetchInitialData} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm active:scale-95">
            Sync Records
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by student, registration, course or book..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="w-full appearance-none bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {/* Custom Table Component */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Book & Course</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="py-24 text-center text-slate-400 font-bold animate-pulse">Fetching Metadata...</td></tr>
                ) : filteredData.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <FaUserCircle size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 uppercase text-xs tracking-tight">
                            {studentDetails[res.student]?.name || "Loading..."}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold flex items-center gap-1">
                            <FaIdCard className="opacity-50" /> {studentDetails[res.student]?.reg || "---"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm flex items-center gap-1">
                            <FaCode size={10} className="text-indigo-400" />
                            {bookDetails[res.book]?.code || "N/A"}
                          </span>
                          <p className="text-sm font-bold text-slate-700">
                            {bookDetails[res.book]?.name || "Loading..."}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <FaClock className="text-slate-300" /> Pickup: {res.expected_pickup_date}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <button 
                        onClick={() => { setSelectedRes(res); setShowStatusModal(true); }}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm ${getStatusStyle(res.status)}`}
                      >
                        {res.status}
                      </button>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button 
                        onClick={() => { setSelectedRes(res); setShowDeleteModal(true); }}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
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
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching records found</p>
            </div>
          )}
        </div>
      </div>

      {/* MODALS: Status Change & Delete Confirmation */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Update Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><FaTimes size={20}/></button>
            </div>
            <div className="flex flex-col gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className={`py-4 px-6 rounded-2xl border font-black text-xs uppercase tracking-[0.2em] transition-all text-center ${getStatusStyle(status)} hover:brightness-95 active:scale-95`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <FaExclamationTriangle size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Are you sure?</h3>
            <p className="text-slate-500 text-sm mt-3 mb-10 font-medium leading-relaxed">Permanent delete record #{selectedRes?.id}? This action cannot be reversed.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Abort</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBookReservation;