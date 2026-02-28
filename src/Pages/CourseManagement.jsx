import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../api/auth";
import { 
  Plus, Trash2, Edit3, BookOpen, 
  Search, Loader2, X, CheckCircle2, 
  Hash, Layers, Calendar, FileText, Activity
} from 'lucide-react';

function CourseManagement() {
  const { user } = useAuth();

  // Data States
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form State matching your JSON structure
  const [formData, setFormData] = useState({
    name: "",
    course_code: "",
    years: 1,
    additional_info: "",
    is_active: true
  });

  const hasFetched = useRef(false);

  // =============== FETCH DATA =================
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCourses = async () => {
      try {
        const headers = { Authorization: `Token ${user?.token}` };
        const res = await api.get("/courses/", { headers });
        // Using res.data.data based on your JSON snippet
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user?.token]);

  // =============== HANDLERS =================
  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        course_code: course.course_code,
        years: course.years,
        additional_info: course.additional_info || "",
        is_active: course.is_active
      });
    } else {
      setEditingCourse(null);
      setFormData({ name: "", course_code: "", years: 1, additional_info: "", is_active: true });
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
        setSuccessMsg("Course specifications updated!");
      } else {
        await api.post("/course/add/", formData, { headers });
        setSuccessMsg("New course initialized successfully!");
      }

      // Refresh list
      const res = await api.get("/courses/", { headers });
      setCourses(res.data?.data || []);
      closeModal();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Error: Ensure Course Code is unique and all fields are valid.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm permanent deletion of this course?")) return;
    try {
      const headers = { Authorization: `Token ${user?.token}` };
      await api.delete(`/course/delete/${id}/`, { headers });
      setCourses(prev => prev.filter(c => c.id !== id));
      setSuccessMsg("Course removed from registry.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Delete request failed.");
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.course_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-slate-900" size={40}/>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">COURSES</h1>
            <p className="text-slate-500 font-medium">Configure academic modules and program durations</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus size={20} /> Create New Course
          </button>
        </div>

        {successMsg && (
          <div className="bg-emerald-500 text-white p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-lg shadow-emerald-100 animate-in slide-in-from-top-4">
            <CheckCircle2 size={20} /> {successMsg}
          </div>
        )}

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
              placeholder="Filter by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 flex items-center justify-center gap-4 shadow-sm">
            <Layers className="text-indigo-500" size={24}/>
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900 leading-none">{courses.length}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modules</div>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-10 py-5">Course Title</th>
                  <th className="px-10 py-5">Code</th>
                  <th className="px-10 py-5">Duration</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="font-bold text-slate-900 text-lg">{c.name}</div>
                      <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">{c.additional_info}</div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black tracking-wider">
                        {c.course_code}
                      </code>
                    </td>
                    <td className="px-10 py-6 text-slate-600 font-bold flex items-center gap-2 pt-8">
                      <Calendar size={16} className="text-slate-400"/>
                      {c.years} {c.years > 1 ? "Years" : "Year"}
                    </td>
                    <td className="px-10 py-6">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit ${c.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        <Activity size={10}/>
                        {c.is_active ? "Active" : "Disabled"}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => openModal(c)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:shadow-md rounded-2xl transition-all">
                            <Edit3 size={18}/>
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:shadow-md rounded-2xl transition-all">
                            <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POP-UP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={closeModal} />
          
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase">{editingCourse ? "Edit Course" : "New Course"}</h2>
                <p className="text-slate-400 text-sm font-medium italic">Define module parameters</p>
              </div>
              <button onClick={closeModal} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <FormInput icon={<BookOpen size={18}/>} label="Full Course Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />

              <div className="grid grid-cols-2 gap-6">
                <FormInput icon={<Hash size={18}/>} label="Course Code" value={formData.course_code} onChange={(e) => setFormData({...formData, course_code: e.target.value})} />
                <FormInput icon={<Calendar size={18}/>} label="Duration (Years)" type="number" value={formData.years} onChange={(e) => setFormData({...formData, years: e.target.value})} />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-1">
                    <FileText size={12}/> Additional Information
                </label>
                <textarea 
                  className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 min-h-[120px]"
                  value={formData.additional_info}
                  onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <input 
                  type="checkbox" 
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 accent-indigo-600"
                />
                <span className="text-sm font-black text-slate-700 uppercase">Set course as active</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-5 font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                <button type="submit" className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-100 transition-all active:scale-95">
                  {editingCourse ? "UPDATE REGISTRY" : "SAVE COURSE"}
                </button>
              </div>
            </form>
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
      <input {...props} required className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" />
    </div>
  </div>
);

export default CourseManagement;