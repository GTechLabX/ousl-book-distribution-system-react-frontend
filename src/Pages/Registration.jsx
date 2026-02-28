import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../api/auth";
import { 
  Plus, Trash2, Edit3, UserPlus, Users, 
  Search, Loader2, X, MapPin, 
  GraduationCap, Mail, CreditCard, Hash, CheckCircle2 
} from 'lucide-react';

function Registration() {
  const { user } = useAuth();

  // Data States
  const [students, setStudents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [degreePrograms, setDegreePrograms] = useState([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    student_name: "", nic: "", s_no: "", reg_no: "",
    email: "", district: "", center: "", degree_program: "",
  });

  const hasFetched = useRef(false);

  // =============== FETCH DATA =================
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Token ${user?.token}` };
        const [resStudents, resCenters, resDistricts, resDegrees] = await Promise.all([
          api.get("/student/", { headers }),
          api.get("/centers/", { headers }),
          api.get("/districts/", { headers }),
          api.get("/degree-programs/", { headers })
        ]);

        setStudents(resStudents.data?.message || []);
        setCenters(resCenters.data?.data || []);
        setDistricts(resDistricts.data?.data || []);
        setDegreePrograms(resDegrees.data?.data || []);
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user?.token]);

  // =============== HANDLERS =================
  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        student_name: student.student_name, nic: student.nic,
        s_no: student.s_no, reg_no: student.reg_no,
        email: student.email, district: student.district,
        center: student.center, degree_program: student.degree_program,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        student_name: "", nic: "", s_no: "", reg_no: "",
        email: "", district: "", center: "", degree_program: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        district: parseInt(formData.district),
        center: parseInt(formData.center),
        degree_program: parseInt(formData.degree_program),
      };
      const headers = { Authorization: `Token ${user?.token}` };

      if (editingStudent) {
        await api.put(`/student/${editingStudent.id}/update/`, payload, { headers });
        setSuccessMsg("Profile updated successfully!");
      } else {
        await api.post("/student_register/", payload, { headers });
        setSuccessMsg("Student enrolled successfully!");
      }

      // Refresh list
      const res = await api.get("/student/", { headers });
      setStudents(res.data?.message || []);
      closeModal();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Error: NIC or Registration Number must be unique.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      await api.delete(`/student/delete/${id}/`, { headers: { Authorization: `Token ${user?.token}` } });
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const filteredStudents = students.filter(s => 
    s.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.reg_no?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Student Registry</h1>
            <p className="text-slate-500 font-medium">Manage academic profiles and study centers</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Student
          </button>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-emerald-100 animate-bounce">
            <CheckCircle2 size={20} /> {successMsg}
          </div>
        )}

        {/* List View */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Student Profile</th>
                  <th className="px-8 py-4">Center & District</th>
                  <th className="px-8 py-4">Program</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900">{s.student_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Mail size={12}/> {s.email}</div>
                      <div className="text-[10px] text-indigo-500 font-black mt-1 uppercase">REG: {s.reg_no}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700 flex items-center gap-1"><MapPin size={14} className="text-rose-500"/> {s.center_name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{s.district_name}</div>
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-slate-600 uppercase">
                      {s.degree_program_name}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(s)} className="p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all"><Edit3 size={18}/></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"><Trash2 size={18}/></button>
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal} />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">{editingStudent ? "Update Profile" : "New Enrollment"}</h2>
                <p className="text-slate-400 text-sm">Fill in the student academic details</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput icon={<Users size={18}/>} label="Full Name" name="student_name" value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} />
                <FormInput icon={<CreditCard size={18}/>} label="NIC Number" name="nic" value={formData.nic} onChange={(e) => setFormData({...formData, nic: e.target.value})} />
                <FormInput icon={<Hash size={18}/>} label="Serial No" name="s_no" value={formData.s_no} onChange={(e) => setFormData({...formData, s_no: e.target.value})} />
                <FormInput icon={<Hash size={18}/>} label="Reg No" name="reg_no" value={formData.reg_no} onChange={(e) => setFormData({...formData, reg_no: e.target.value})} />
              </div>
              
              <FormInput icon={<Mail size={18}/>} label="Email Address" type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect label="District" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} options={districts.map(d => ({id: d.id, name: d.district_name}))} />
                <FormSelect label="Center" value={formData.center} onChange={(e) => setFormData({...formData, center: e.target.value})} options={centers.map(c => ({id: c.id, name: c.c_name}))} />
                <FormSelect label="Program" value={formData.degree_program} onChange={(e) => setFormData({...formData, degree_program: e.target.value})} options={degreePrograms.map(d => ({id: d.id, name: d.d_program}))} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
                  {editingStudent ? "Save Changes" : "Confirm Enrollment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
const FormInput = ({ icon, label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input {...props} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-slate-700" />
    </div>
  </div>
);

const FormSelect = ({ label, options, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
    <select {...props} required className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer">
      <option value="">Select...</option>
      {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
  </div>
);

export default Registration;