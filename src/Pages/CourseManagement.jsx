import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../api/auth";
import { 
  Plus, Trash2, Edit3, BookOpen, 
  Search, Loader2, X, CheckCircle2, 
  Hash, Layers, Calendar, FileText, Activity, AlertCircle
} from 'lucide-react';

function CourseManagement() {
  const { user } = useAuth();

  // Data States
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [notification, setNotification] = useState({ message: "", type: "" }); // type: "success" | "error"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Form State matching your JSON ("months" logic)
  const [formData, setFormData] = useState({
    name: "",
    course_code: "",
    months: 12, // Backend uses months
    additional_info: "",
    is_active: true
  });

  const hasFetched = useRef(false);

  // =============== UTILS =================
  const showToast = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // =============== FETCH DATA =================
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCourses();
  }, [user?.token]);

  const fetchCourses = async () => {
    try {
      const headers = { Authorization: `Token ${user?.token}` };
      const res = await api.get("/courses/", { headers });
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load courses", err);
      showToast("Could not sync with registry", "error");
    } finally {
      setLoading(false);
    }
  };

  // =============== HANDLERS =================
  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        course_code: course.course_code,
        months: course.months || 12,
        additional_info: course.additional_info || "",
        is_active: course.is_active
      });
    } else {
      setEditingCourse(null);
      setFormData({ name: "", course_code: "", months: 12, additional_info: "", is_active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Token ${user?.token}` };
      if (editingCourse) {
        await api.put(`/course/update/${editingCourse.id}/`, formData, { headers });
        showToast("Course specifications updated!");
      } else {
        await api.post("/course/add/", formData, { headers });
        showToast("New course initialized successfully!");
      }
      fetchCourses();
      closeModal();
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed. Check course code uniqueness.", "error");
    }
  };

  const confirmDelete = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      const headers = { Authorization: `Token ${user?.token}` };
      await api.delete(`/course/delete/${courseToDelete.id}/`, { headers });
      setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
      showToast("Course removed from registry.");
    } catch (err) {
      showToast("Delete request failed.", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.course_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600" size={40}/>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ACADEMIC MODULES</h1>
            <p className="text-slate-500 font-medium">Configure course registry and durations</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            <Plus size={20} /> New Course
          </button>
        </div>

        {/* Floating Notification */}
        {notification.message && (
          <div className={`fixed top-10 right-10 z-[100] p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-right-10 ${
            notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20}/>}
            <span className="font-bold">{notification.message}</span>
          </div>
        )}

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 shadow-sm"
              placeholder="Filter modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 flex items-center justify-center gap-4 shadow-sm">
            <Layers className="text-indigo-500" size={24}/>
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900 leading-none">{courses.length}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items</div>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-10 py-5">Module Identity</th>
                <th className="px-10 py-5">Code</th>
                <th className="px-10 py-5">Duration</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="font-bold text-slate-900 text-lg">{c.name}</div>
                    <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">{c.additional_info || "No details provided"}</div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black tracking-wider">
                      {c.course_code}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <Calendar size={16} className="text-slate-300"/>
                      {c.months} Months
                      <span className="text-[10px] text-slate-400 font-medium">({c.months/12} Year)</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit ${c.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <Activity size={10}/>
                      {c.is_active ? "Active" : "Disabled"}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(c)} className="p-3 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><Edit3 size={18}/></button>
                      <button onClick={() => confirmDelete(c)} className="p-3 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl animate-in zoom-in-95 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">{editingCourse ? "Update Course" : "Create Course"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <FormInput icon={<BookOpen size={18}/>} label="Course Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-5">
                <FormInput icon={<Hash size={18}/>} label="Module Code" value={formData.course_code} onChange={(e) => setFormData({...formData, course_code: e.target.value})} />
                <FormInput icon={<Calendar size={18}/>} label="Duration (Months)" type="number" value={formData.months} onChange={(e) => setFormData({...formData, months: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Description</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 min-h-[100px]"
                  value={formData.additional_info}
                  onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 accent-indigo-600 rounded" />
                <span className="text-xs font-black text-slate-700 uppercase">Available for Enrollment</span>
              </div>

              <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all active:scale-[0.98]">
                {editingCourse ? "SAVE CHANGES" : "INITIALIZE MODULE"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Delete Module?</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">This will permanently remove <span className="text-slate-900 font-bold">"{courseToDelete?.course_code}"</span>. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FormInput = ({ icon, label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input {...props} required className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" />
    </div>
  </div>
);

export default CourseManagement;