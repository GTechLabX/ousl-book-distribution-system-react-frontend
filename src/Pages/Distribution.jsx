import React, { useState, useEffect, useCallback } from 'react';
import api from "../api/axios";
import { useAuth } from "../api/auth";
import { 
  Plus, Trash2, Edit3, MapPin, 
  Loader2, X, AlertCircle, Package, Calendar, Clock, CheckCircle2, BookOpen
} from 'lucide-react';

function Distribution() {
  const { user } = useAuth();
  
  // Data States
  const [allocations, setAllocations] = useState([]);
  const [books, setBooks] = useState([]); // To store book list for dropdown
  const [centers, setCenters] = useState([]); // To store center list for dropdown
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    center: '',
    books: '',
    date: new Date().toISOString().split('T')[0],
    time: "09:00:00",
    allocation_quantity: 0,
    status: 'pending'
  });

  // 1. READ: Fetch All Data (Allocations, Books, and Centers)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Concurrent fetching for better performance
      const [resAlloc, resBooks, resCenters] = await Promise.all([
        api.get("/center-books/"),
        api.get("/books/"),
        api.get("/centers/")
      ]);
      
      // Setting Allocations
      if (resAlloc.data?.success) {
        setAllocations(resAlloc.data.data);
      }

      // Setting Books (using your specific JSON structure)
      if (resBooks.data?.success) {
        setBooks(resBooks.data.data);
      }

      // Setting Centers (using your specific JSON structure)
      if (resCenters.data?.success) {
        setCenters(resCenters.data.data);
      }

    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to sync with server. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Modal UI Logic
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({
        center: item.center,
        books: item.books,
        date: item.date,
        time: item.time,
        allocation_quantity: item.allocation_quantity,
        status: item.status
      });
    } else {
      setEditId(null);
      setFormData({
        center: '',
        books: '',
        date: new Date().toISOString().split('T')[0],
        time: "09:00:00",
        allocation_quantity: 0,
        status: 'pending'
      });
    }
    setIsModalOpen(true);
  };

  // 2. CREATE & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/center-book/update/${editId}/`, formData);
      } else {
        await api.post("/center-book/add/", formData);
      }
      setIsModalOpen(false);
      fetchData(); 
    } catch (err) {
      alert("Submission failed. Ensure stock is available.");
    }
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Delete this allocation record?")) {
      try {
        await api.delete(`/center-book/delete/${id}/`);
        setAllocations(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        setError("Could not delete record.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Stock Distribution</h1>
            <p className="text-slate-500 font-medium">Regional Center Management</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95 font-bold"
          >
            <Plus size={22} /> Assign New Stock
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Data List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold">Syncing inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allocations.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between hover:border-indigo-400 transition-all shadow-sm">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`p-5 rounded-2xl ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{item.book_name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-2 font-medium">
                      <span className="flex items-center gap-1 text-indigo-600"><MapPin size={15} /> {item.center_name}</span>
                      <span className="flex items-center gap-1"><Calendar size={15} /> {item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto md:gap-12 mt-8 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Quantity</p>
                    <p className="text-2xl font-black text-slate-900">{item.allocation_quantity}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2.5 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add & Update */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">{editId ? 'Update Entry' : 'New Assignment'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* CENTER DROPDOWN */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
                      <MapPin size={12} /> Target Center
                    </label>
                    <select 
                      required 
                      value={formData.center} 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                      onChange={e => setFormData({...formData, center: e.target.value})}
                    >
                      <option value="">Select a Center</option>
                      {centers.map(center => (
                        <option key={center.id} value={center.id}>
                          {center.c_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BOOK DROPDOWN */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
                      <BookOpen size={12} /> Select Book
                    </label>
                    <select 
                      required 
                      value={formData.books} 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                      onChange={e => setFormData({...formData, books: e.target.value})}
                    >
                      <option value="">Select a Book</option>
                      {books.map(book => (
                        <option key={book.id} value={book.id}>
                          {book.name} (Stock: {book.left_quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Quantity</label>
                    <input type="number" required value={formData.allocation_quantity} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-xl font-black"
                      onChange={e => setFormData({...formData, allocation_quantity: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Status</label>
                    <select value={formData.status} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold cursor-pointer"
                      onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Date</label>
                  <input type="date" value={formData.date} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none outline-none font-bold"
                    onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-3xl font-black text-lg shadow-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2">
                  <CheckCircle2 size={22} />
                  {editId ? 'Commit Update' : 'Finalize Allocation'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Distribution;