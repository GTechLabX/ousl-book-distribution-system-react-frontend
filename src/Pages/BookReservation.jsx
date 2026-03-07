import React, { useState, useEffect } from "react";
import { 
  FaSearch, FaBookmark, FaMapMarkerAlt, FaExclamationTriangle, 
  FaWarehouse, FaHistory, FaCheckCircle, FaClock, FaBookOpen, FaBan, FaInfoCircle
} from "react-icons/fa";
import { Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function BookReservation() {
  const { user } = useAuth();
  
  const [studentInfo, setStudentInfo] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [books, setBooks] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const notify = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [studentRes, centersRes, resRes] = await Promise.all([
          api.get("/student-book-reservation/1/"), 
          api.get("/centers/"),
          api.get("/book-reservations/")
        ]);
        if (studentRes.data.success) {
          setStudentInfo(studentRes.data.data.student);
          setRegisteredCourses(studentRes.data.data.registered_courses);
        }
        setCenters(centersRes.data.success ? centersRes.data.data : []);
        setMyReservations(resRes.data.success ? resRes.data.data : []);
      } catch (err) {
        notify("Server Connection Error", "error");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStudentData();
  }, [user]);

  useEffect(() => {
    if (selectedCenterId) {
      api.get(`/center-books/?center_id=${selectedCenterId}`)
         .then(res => setBooks(res.data.success ? res.data.data : []));
    }
  }, [selectedCenterId]);

  const handleReserve = async (bookId, courseCode) => {
    try {
      const res = await api.post("/book-reservation/add/", { 
        book: bookId, center: selectedCenterId, course_code: courseCode, status: "PENDING" 
      });
      if (res.data.success) {
        notify("Reservation request sent successfully!");
        const resUpdate = await api.get("/book-reservations/");
        setMyReservations(resUpdate.data.success ? resUpdate.data.data : []);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Already requested", "error");
    }
  };

  const filteredBooks = books.filter(b => 
    registeredCourses.some(c => c.course_code === b.course_code) &&
    b.book_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Profile Row */}
        <div className="bg-white rounded-[2rem] p-8 mb-8 border border-slate-200 flex flex-col md:flex-row justify-between items-center shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">
              {studentInfo?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">{studentInfo?.name}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{studentInfo?.reg_no} • Enrolled 2026</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 px-6 py-3 bg-indigo-50 rounded-xl">
             <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Student Portal Active</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-4">
            <select 
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
            >
              <option value="">Select Dispatch Center</option>
              {centers.map(c => <option key={c.id} value={c.id}>{c.c_name}</option>)}
            </select>
          </div>
          <div className="lg:col-span-8">
            <div className="relative">
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text"
                placeholder="Search materials by name or course code..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List Header */}
        <div className="hidden md:grid grid-cols-12 px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="col-span-5">Material & Course Code</div>
          <div className="col-span-2 text-center">Stock Level</div>
          <div className="col-span-3 text-center">Issuance Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Row-Wise List */}
        <div className="space-y-3">
          {!selectedCenterId ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
              <FaWarehouse className="mx-auto text-slate-100 mb-4" size={48} />
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Please choose a center to view materials</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const courseMeta = registeredCourses.find(c => c.course_code === book.course_code);
              const canIssue = courseMeta?.is_book_available;

              return (
                <div key={book.id} className={`grid grid-cols-1 md:grid-cols-12 items-center bg-white px-10 py-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md ${!canIssue && 'bg-slate-50 opacity-75'}`}>
                  
                  {/* Book Info */}
                  <div className="col-span-5 flex items-center gap-5">
                    <div className={`p-3 rounded-xl ${canIssue ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                      <FaBookmark size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase text-sm leading-none mb-1">{book.book_name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{book.course_code}</p>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="col-span-2 text-center mt-4 md:mt-0">
                    <div className="md:hidden text-[9px] font-black text-slate-300 uppercase mb-1">Stock</div>
                    <span className={`text-sm font-black ${book.allocation_quantity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {book.allocation_quantity} <span className="text-[9px] text-slate-300">PCS</span>
                    </span>
                  </div>

                  {/* Issuance Status */}
                  <div className="col-span-3 text-center mt-4 md:mt-0">
                    <div className="md:hidden text-[9px] font-black text-slate-300 uppercase mb-1">Status</div>
                    {canIssue ? (
                      <span className="flex items-center justify-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <FaCheckCircle className="text-indigo-400" /> Eligible for Issue
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                        <FaBan size={10} /> Do not issue book
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="col-span-2 text-right mt-6 md:mt-0">
                    {canIssue ? (
                      <button 
                        onClick={() => handleReserve(book.books, book.course_code)}
                        disabled={book.allocation_quantity <= 0}
                        className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300"
                      >
                        Request
                      </button>
                    ) : (
                      <button disabled className="w-full md:w-auto px-6 py-3 bg-transparent border border-slate-200 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-[2rem] text-center border border-slate-200">
               <FaInfoCircle className="mx-auto text-slate-200 mb-2" />
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matching course materials found</p>
            </div>
          )}
        </div>

        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl border animate-in slide-in-from-bottom-5 ${
            notification.type === 'success' ? 'bg-slate-900 text-white border-slate-800' : 'bg-rose-600 text-white border-rose-500'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={18} /> : <FaExclamationTriangle size={18} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookReservation;