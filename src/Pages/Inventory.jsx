import React, { useState, useEffect, useRef } from "react";
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, 
  FaExclamationTriangle, FaClock
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function Inventory() {
  const { user } = useAuth();

  // Core Data State
  const [books, setBooks] = useState([]); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // UI & Modal States
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    course: "", 
    printed_quantity: "",
    left_quantity: "",
    description: ""
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchInventory();
    fetchCourses();
  }, []);

  // =============== UTILS =================
  const showToast = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/books/", {
        headers: { Authorization: `Bearer ${user?.access}` }
      });
      const data = res.data.success ? res.data.data : [];
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Sync Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/", {
        headers: { Authorization: `Bearer ${user?.access}` }
      });
      const data = res.data.success ? res.data.data : res.data;
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Courses fetch error", err);
    }
  };

  // =============== HANDLERS =================
  const handleOpenModal = (book = null) => {
    if (book) {
      setCurrentBook(book);
      setFormData({
        name: book.name,
        course: book.course,
        printed_quantity: book.printed_quantity,
        left_quantity: book.left_quantity,
        description: book.description || ""
      });
    } else {
      setCurrentBook(null);
      setFormData({ name: "", course: "", printed_quantity: "", left_quantity: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user?.access}` } };
      if (currentBook) {
        await api.put(`/book/update/${currentBook.id}/`, formData, config);
        showToast("Updated Successfully");
      } else {
        await api.post("/book/add/", formData, config);
        showToast("Added Successfully");
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) {
      showToast("Failed to save", "error");
    }
  };

  const confirmDelete = (book) => {
    setCurrentBook(book);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!currentBook) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user?.access}` } };
      await api.delete(`/book/delete/${currentBook.id}/`, config);
      showToast("Deleted Successfully");
      fetchInventory();
    } catch (err) {
      showToast("Delete Error", "error");
    } finally {
      setShowDeleteModal(false);
      setCurrentBook(null);
    }
  };

  // Filter by Title OR Course Code
  const filteredBooks = books.filter((b) => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.course_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Toast Notification */}
        {notification.message && (
          <div className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-xl shadow-2xl font-bold text-[13px] animate-in fade-in slide-in-from-top-4 ${notification.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Inventory</h1>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.2em]">Management System</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-[12px] transition shadow-lg shadow-blue-100 active:scale-95 uppercase"
          >
            <FaPlus size={10} /> NEW TITLE
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Items" value={filteredBooks.length} color="blue" />
          <StatCard label="Available" value={filteredBooks.reduce((acc, b) => acc + (parseInt(b.left_quantity) || 0), 0)} color="emerald" />
          <StatCard label="Critical" value={filteredBooks.filter(b => (b.left_quantity / b.printed_quantity) < 0.2).length} color="rose" />
          <StatCard label="Grand Total" value={filteredBooks.reduce((acc, b) => acc + (parseInt(b.printed_quantity) || 0), 0)} color="purple" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-sm">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4" />
          <input
            type="text"
            placeholder="Search titles or code (e.g. PY001)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-[13px] font-bold text-slate-600 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="py-4 px-6">ID & Course</th>
                <th className="py-4 px-6">Title / Description</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6">Timestamps</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-slate-300 text-[12px] uppercase font-bold italic tracking-widest">Refreshing Data...</td></tr>
              ) : filteredBooks.map((book) => {
                const stockPercent = (parseInt(book.left_quantity) / parseInt(book.printed_quantity)) * 100;
                const courseName = courses.find(c => c.id === book.course)?.name || `Course #${book.course}`;
                
                return (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group text-[13px]">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-black text-slate-400 leading-none">#{book.id}</span>
                         {book.course_code && (
                           <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black text-[10px] uppercase border border-slate-200">
                             {book.course_code}
                           </span>
                         )}
                      </div>
                      <div className="text-[11px] text-blue-500 font-bold uppercase tracking-tight">{courseName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 uppercase tracking-tight leading-tight mb-1">{book.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{book.description}</div>
                    </td>
                    <td className="py-4 px-6 min-w-[180px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className={stockPercent < 20 ? "text-rose-500" : "text-slate-600"}>{book.left_quantity} Left</span>
                          <span className="text-slate-300">{book.printed_quantity} Total</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${stockPercent < 20 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                            style={{ width: `${Math.min(100, stockPercent)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5 whitespace-nowrap"><FaPlus size={9}/> {new Date(book.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap"><FaClock size={9}/> {new Date(book.updated_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(book)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><FaEdit size={14}/></button>
                        <button onClick={() => confirmDelete(book)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><FaTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash size={24} />
            </div>
            <h3 className="font-black text-slate-900 uppercase text-[14px] mb-2 tracking-tight">Remove Record?</h3>
            <p className="text-[12px] text-slate-400 font-bold mb-8 leading-relaxed">
              Delete <span className="text-rose-500">"{currentBook?.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[11px] uppercase hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-black text-[11px] uppercase shadow-lg shadow-rose-100 hover:bg-rose-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h2 className="text-[12px] font-black uppercase tracking-widest">{currentBook ? "Edit Title" : "New Entry"}</h2>
              <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform"><FaTimes size={14}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-transparent focus:border-blue-200 rounded-xl outline-none font-bold text-[13px] transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Printed Qty</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-[13px]" value={formData.printed_quantity} onChange={(e) => setFormData({...formData, printed_quantity: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Stock</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-[13px]" value={formData.left_quantity} onChange={(e) => setFormData({...formData, left_quantity: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program</label>
                <select className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-[13px] outline-none" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required>
                  <option value="">Choose Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} {c.course_code ? `(${c.course_code})` : ""}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-[13px] h-24 resize-none outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black text-[12px] rounded-2xl tracking-[0.2em] mt-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all uppercase">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ label, value, color }) => {
  const themes = {
    blue: "text-blue-600 border-blue-100",
    emerald: "text-emerald-600 border-emerald-100",
    rose: "text-rose-600 border-rose-100",
    purple: "text-purple-600 border-purple-100"
  };
  return (
    <div className={`bg-white px-6 py-5 rounded-2xl border-l-4 ${themes[color]} shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</p>
      <p className="text-2xl font-black tracking-tighter">{value}</p>
    </div>
  );
};

export default Inventory;