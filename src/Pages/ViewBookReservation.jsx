import React, { useState, useEffect } from "react";
import { 
  FaSearch, FaCalendarCheck, FaClock, FaCheckCircle, 
  FaExclamationTriangle, FaFilter, FaUserCircle, FaBookOpen 
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function ViewBookReservation() {
  const { user: currentUser } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/view-book-reservation/", {
        headers: { Authorization: `Bearer ${currentUser?.access}` }
      });
      setReservations(res.data.success ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COLLECTED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'EXPIRED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredData = reservations.filter(res => {
    const matchesSearch = 
      res.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.book?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              <FaCalendarCheck className="text-[#0c4187]" /> Reservation Registry
            </h1>
            <p className="text-gray-500 mt-1">Monitor and manage book collection statuses for all students.</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchReservations}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
            >
              Refresh Data
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by student or book name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#0c4187] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 ml-2" />
            <select 
              className="bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#0c4187]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Collection</option>
              <option value="COLLECTED">Collected</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Details</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reserved Date</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-gray-400 italic">Syncing reservation records...</td></tr>
              ) : filteredData.map((res) => (
                <tr key={res.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#0c4187] group-hover:text-white transition-colors">
                        <FaUserCircle size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{res.user?.username}</p>
                        <p className="text-[10px] text-gray-400 font-mono uppercase">{res.user?.email || 'No Email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <FaBookOpen className="text-gray-300" />
                      <p className="text-sm font-semibold text-gray-700">{res.book?.name}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-6 font-bold">COURSE: {res.book?.course}</p>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(res.reserved_date).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <FaClock size={10} /> {new Date(res.reserved_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${getStatusStyle(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button className="text-[#0c4187] bg-blue-50 hover:bg-[#0c4187] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95">
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredData.length === 0 && (
            <div className="py-20 text-center">
              <FaExclamationTriangle className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-medium">No reservation records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewBookReservation;