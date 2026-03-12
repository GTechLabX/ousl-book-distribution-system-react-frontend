import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../api/auth";
import { 
  ArrowLeft, Search, Lock, BookOpen, 
  CheckCircle2, Hash, Calendar, Loader2,
  Filter, Trash2, GraduationCap, AlertCircle
} from "lucide-react";

function Enrollment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Student ID

  const student = location.state;

  const [courses, setCourses] = useState([]);
  const [enrolledRecords, setEnrolledRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterType, setFilterType] = useState("all");

  // State for Enrollment Pop-up
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // State for Delete Pop-up
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user?.access]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.access}` } };
      const coursesRes = await api.get("/courses/", config);
      const allCourses = coursesRes.data?.data || [];
      const enrollRes = await api.get("/student-courses/", config);
      const myEnrollments = (enrollRes.data?.data || []).filter(
        (item) => item.student === parseInt(id)
      );
      setEnrolledRecords(myEnrollments);
      setCourses(allCourses);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEnrollModal = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const handleOpenDeleteModal = (record, courseName) => {
    setRecordToDelete({ id: record.id, name: courseName });
    setShowDeleteModal(true);
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.access}` } };
      await api.post("/student-course/add/", {
        student: parseInt(id),
        course: selectedCourse.id
      }, config);

      setSuccessMsg(`Successfully enrolled in ${selectedCourse.name}`);
      setShowEnrollModal(false);
      setSelectedCourse(null);
      fetchData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Error occurred during enrollment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeEnroll = async () => {
    if (!recordToDelete) return;
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.access}` } };
      // Corrected URL: student-course/delete/{id}/
      await api.delete(`/student-course/delete/${recordToDelete.id}/`, config);
      setSuccessMsg("Enrollment removed successfully");
      setShowDeleteModal(false);
      setRecordToDelete(null);
      fetchData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Error occurred while removing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnrollmentData = (courseId) => {
    return enrolledRecords.find(r => r.course === courseId);
  };

  const filteredCourses = courses.filter(c => {
    const isEnrolled = !!getEnrollmentData(c.id);
    const matchesSearch = 
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.course_code || "").toLowerCase().includes(search.toLowerCase());
    const matchesTab = filterType === "all" ? true : isEnrolled;
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <BookOpen className="text-indigo-600" size={24} />
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Course Enrollment</h1>
            </div>
            <p className="text-slate-500 font-medium text-[15px]">
              Managing: <span className="text-indigo-600 font-bold uppercase">{student?.student_name || "Student #" + id}</span>
            </p>
          </div>

          <button 
            onClick={() => navigate("/registration")}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold shadow-sm hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
          >
            <ArrowLeft size={18}/> Back to Registry
          </button>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={20} /> {successMsg}
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by course name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
              <button onClick={() => setFilterType("all")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                All ({courses.length})
              </button>
              <button onClick={() => setFilterType("enrolled")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === "enrolled" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                Enrolled ({enrolledRecords.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">Course Name</th>
                  <th className="px-8 py-4">Code</th>
                  <th className="px-8 py-4">Program Type</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map(course => {
                  const enrollData = getEnrollmentData(course.id);
                  return (
                    <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900 text-[15px] uppercase">{course.name}</div>
                        {enrollData && <div className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Enrolled: {new Date(enrollData.enrollment_date).toLocaleDateString()}</div>}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-slate-600 font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg w-fit text-xs border border-slate-200">
                          <Hash size={12} className="text-slate-400" />
                          {course.course_code}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                           {course.is_active ? "Full Time" : "Part Time"}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {enrollData ? (
                          <div className="flex justify-end items-center gap-3">
                            <div className="inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                              <Lock size={14}/> Assigned
                            </div>
                            <button 
                              onClick={() => handleOpenDeleteModal(enrollData, course.name)}
                              className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenEnrollModal(course)}
                            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                          >
                            Enroll Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ENROLLMENT MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Confirm Enrollment</h3>
              <p className="text-slate-500 font-medium mb-8">
                Enroll <span className="text-indigo-600 font-bold uppercase">{student?.student_name}</span> in:
              </p>
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
                <div className="text-lg font-black text-slate-900 uppercase leading-tight">{selectedCourse?.name}</div>
                <div className="text-sm font-bold text-slate-500 font-mono mt-1">{selectedCourse?.course_code}</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEnrollModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={handleEnroll} disabled={isSubmitting} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-rose-500">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Remove Enrollment</h3>
              <p className="text-slate-500 font-medium mb-8">
                Are you sure you want to remove <span className="text-rose-500 font-bold uppercase">{recordToDelete?.name}</span> from this student's profile?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Go Back</button>
                <button onClick={handleDeEnroll} disabled={isSubmitting} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Remove Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enrollment;