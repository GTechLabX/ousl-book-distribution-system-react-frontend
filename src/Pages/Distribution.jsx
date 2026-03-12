import React, { useState, useEffect, useCallback } from 'react';
import api from "../api/axios";
import { useAuth } from "../api/auth";
import { 
  Plus, Trash2, Edit3, MapPin, 
  Loader2, X, AlertCircle, Package, 
  BookOpen, CheckCircle2, Trash, Tag
} from 'lucide-react';

function Distribution() {
  const { user } = useAuth();
  
  const [allocations, setAllocations] = useState([]);
  const [books, setBooks] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    center: '',
    books: '',
    date: new Date().toISOString().split('T')[0],
    time: "09:00:00",
    allocation_quantity: 0,
    status: 'pending'
  });

  const notify = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resAlloc, resBooks, resCenters] = await Promise.all([
        api.get("/center-books/"),
        api.get("/books/"),
        api.get("/centers/")
      ]);
      if (resAlloc.data?.success) setAllocations(resAlloc.data.data);
      if (resBooks.data?.success) setBooks(resBooks.data.data);
      if (resCenters.data?.success) setCenters(resCenters.data.data);
    } catch (err) {
      notify("Failed to sync database records", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({
        center: item.center, books: item.books,
        date: item.date, time: item.time,
        allocation_quantity: item.allocation_quantity, status: item.status
      });
    } else {
      setEditId(null);
      setFormData({
        center: '', books: '', 
        date: new Date().toISOString().split('T')[0],
        time: "09:00:00", allocation_quantity: 0, status: 'pending'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await api.put(`/center-book/update/${editId}/`, formData);
        notify("Allocation updated successfully");
      } else {
        await api.post("/center-book/add/", formData);
        notify("New stock assigned to center");
      }
      setIsModalOpen(false);
      fetchData(); 
    } catch (err) {
      notify(err.response?.data?.message || "Action failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/center-book/delete/${itemToDelete.id}/`);
      setAllocations(prev => prev.filter(item => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      notify("Record permanently removed", "success");
    } catch (err) {
      notify("Delete failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans relative overflow-x-hidden">
      
      {/* NOTIFICATION TOAST */}
      {notification.show && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-5 duration-300 ${
          notification.type === 'success' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-rose-600 border-rose-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={20} /> : <AlertCircle size={20} />}
          <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
          <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Package className="text-indigo-600" size={28} />
               <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Stock Distribution</h1>
            </div>
            <p className="text-slate-500 font-medium text-[15px]">Regional Center Inventory Records</p>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={18}/> Assign New Stock
          </button>
        </div>

        {/* Row-Wise Data List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="animate-spin mb-4 text-indigo-600" size={40} />
              <p className="font-black text-xs uppercase tracking-widest">Syncing Records...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="hidden md:grid grid-cols-12 bg-slate-50/80 px-10 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <div className="col-span-4">Item, Code & Destination</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2 text-center">Date</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {allocations.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-10 py-7 hover:bg-slate-50/50 transition-colors group">
                  <div className="col-span-4 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-black text-slate-900 text-[15px] uppercase leading-none">{item.book_with_course}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-wide">
                        <MapPin size={12} className="text-indigo-600" /> {item.center_name}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 mt-4 md:mt-0 font-black text-slate-900 text-xl">
                    {item.allocation_quantity} <span className="text-[10px] text-slate-400 uppercase font-bold">Units</span>
                  </div>
                  <div className="col-span-2 text-left md:text-center mt-4 md:mt-0">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs font-bold">{item.date}</span>
                  </div>
                  <div className="col-span-2 text-left md:text-center mt-4 md:mt-0 uppercase tracking-widest font-black text-[10px]">
                    <span className={item.status === 'approved' ? 'text-emerald-500' : item.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'}>
                      ● {item.status}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 rounded-xl transition-all shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => {setItemToDelete(item); setIsDeleteModalOpen(true);}} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-600 rounded-xl transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

 {/* MODALS */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {editId ? 'Update Stock Entry' : 'New Material Allocation'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
                    {editId ? 'Modify existing record' : 'Create a new inventory distribution'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-5">
                  
                  {/* Center Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Target Center</label>
                    <div className="relative">
                      <select 
                        required 
                        value={formData.center} 
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-700 appearance-none transition-all cursor-pointer"
                        onChange={e => setFormData({...formData, center: e.target.value})}
                      >
                        <option value="">Select a distribution center</option>
                        {centers.map(center => <option key={center.id} value={center.id}>{center.c_name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Material Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Resource Material</label>
                    <select 
                      required 
                      value={formData.books} 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-700 appearance-none transition-all cursor-pointer"
                      onChange={e => setFormData({...formData, books: e.target.value})}
                    >
                      <option value="">Select study material/book</option>
                      {books.map(book => (
                        <option key={book.id} value={book.id}>
                          {book.name} — (Available: {book.left_quantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Quantity */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Amount</label>
                      <input 
                        type="number" 
                        required 
                        value={formData.allocation_quantity} 
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-900"
                        onChange={e => setFormData({...formData, allocation_quantity: e.target.value})} 
                        placeholder="0" 
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Status</label>
                      <select 
                        value={formData.status} 
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-xs uppercase tracking-tighter"
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="pending">🟡 Pending</option>
                        <option value="approved">🟢 Approved</option>
                        <option value="rejected">🔴 Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20}/>
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    {editId ? 'Update Allocation' : 'Confirm Allocation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border-t-8 border-rose-500">
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Confirm Delete</h3>
                <p className="text-slate-500 font-medium mb-8 uppercase text-[10px] tracking-widest leading-relaxed">
                   Permanently remove <span className="text-rose-600 font-black">{itemToDelete?.book_with_course}</span> ({itemToDelete?.course_code})?
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs tracking-widest uppercase">Cancel</button>
                  <button onClick={handleDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase">Delete Now</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Distribution;




      