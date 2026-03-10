import React, { useState, useEffect, useCallback } from "react";
import { FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle, FaUserCircle, FaCalendarAlt, FaTimes, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function BookReservation() {
  const { user } = useAuth();
  
  // Data States
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [allInventory, setAllInventory] = useState([]); 
  const [existingReservations, setExistingReservations] = useState([]); 
  
  // UI States
  const [pageLoading, setPageLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState("");

  // Notification State
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // NEW
  const [selectedBook, setSelectedBook] = useState(null);
  const [resToDelete, setResToDelete] = useState(null); // NEW: Track which reservation to delete
  
  const [reservationData, setReservationData] = useState({
    expected_pickup_date: "",
    remarks: ""
  });

  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const fetchReservations = useCallback(async () => {
    try {
      const res = await api.get("/book-reservations/");
      if (res.data.success) {
        const studentId = studentInfo?.id;
        const myReservations = res.data.data.filter(r => r.student === studentId && r.is_active);
        setExistingReservations(myReservations);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  }, [studentInfo?.id]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.uuid) return;
      try {
        setPageLoading(true);
        const [studentRes, centersRes] = await Promise.all([
          api.get(`/student-book-reservation/${user.uuid}/`),
          api.get("/centers/")
        ]);

        if (studentRes.data.success) {
          setStudentInfo(studentRes.data.data.student);
          setStudentCourses(studentRes.data.data.courses || []);
        }
        if (centersRes.data.success) {
          setCenters(centersRes.data.data);
        }
      } catch (err) {
        console.error("Initialization Error:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchInitialData();
  }, [user?.uuid]);

  useEffect(() => {
    if (studentInfo?.id) fetchReservations();
  }, [studentInfo, fetchReservations]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!selectedCenterId) {
        setAllInventory([]);
        return;
      }
      try {
        setInventoryLoading(true);
        const res = await api.get("/center-books/");
        if (res.data.success) {
          setAllInventory(res.data.data);
        }
      } catch (err) {
        console.error("Inventory Fetch Error:", err);
      } finally {
        setTimeout(() => setInventoryLoading(false), 400);
      }
    };
    fetchInventory();
  }, [selectedCenterId]);

  // NEW: Confirmation Modal Trigger
  const confirmDelete = (reservation) => {
    setResToDelete(reservation);
    setIsDeleteModalOpen(true);
  };

  // NEW: Final Delete Execution
  const handleFinalDelete = async () => {
    if (!resToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/book-reservation/delete/${resToDelete.id}/`);
      showToast("Reservation cancelled successfully", "success");
      setIsDeleteModalOpen(false);
      setResToDelete(null);
      fetchReservations();
    } catch (err) {
      showToast("Could not cancel reservation", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      student: studentInfo.id,
      book: selectedBook.books, 
      center: Number(selectedCenterId),
      expected_pickup_date: reservationData.expected_pickup_date,
      remarks: reservationData.remarks,
      status: "PENDING",
      is_active: true,
      expires_at: new Date(new Date(reservationData.expected_pickup_date).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };

    try {
      const response = await api.post("/book-reservation/add/", payload);
      if (response.status === 201 || response.data.success) {
        showToast("Reservation submitted!", "success");
        setIsModalOpen(false);
        setReservationData({ expected_pickup_date: "", remarks: "" });
        fetchReservations();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create reservation", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Authenticating...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
              <FaUserCircle />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">{studentInfo?.student_name}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Reg: {studentInfo?.reg_no} • NIC: {studentInfo?.nic}
              </p>
            </div>
          </div>

          <div className="w-full md:w-80">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Distribution Center</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 z-10" />
              <select 
                className="relative w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                value={selectedCenterId}
                onChange={(e) => setSelectedCenterId(e.target.value)}
              >
                <option value="">Select a Hub</option>
                {centers.map(c => <option key={c.id} value={c.id}>{c.c_name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative min-h-[300px]">
          {inventoryLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Updating...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Code</th>
                <th className="px-8 py-5">Course Description</th>
                <th className="px-8 py-5 text-center">Status / Stock</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentCourses.map((course) => {
                const matchedBook = allInventory.find(inv => 
                  inv.book_name?.toLowerCase().trim() === course.course_name?.toLowerCase().trim() &&
                  Number(inv.center) === Number(selectedCenterId)
                );

                const activeRes = matchedBook ? existingReservations.find(r => r.book === matchedBook.books) : null;
                const stock = matchedBook ? matchedBook.allocation_quantity : 0;
                const canReserve = stock > 0 && selectedCenterId && !activeRes;

                return (
                  <tr key={course.course_id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg">{course.course_code}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-800 text-sm">{course.course_name}</p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase mt-0.5">Year: {course.register_year}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {activeRes ? (
                        <div className="flex flex-col items-center">
                           <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-full border border-blue-100 tracking-tighter uppercase">{activeRes.status}</span>
                           <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Pickup: {activeRes.expected_pickup_date}</span>
                        </div>
                      ) : !selectedCenterId ? (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">Pending Hub</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className={`text-xl font-black ${stock > 0 ? 'text-slate-800' : 'text-rose-300'}`}>{stock}</span>
                          <span className={`text-[9px] font-black uppercase flex items-center gap-1 ${stock > 0 ? 'text-green-500' : 'text-rose-500'}`}>
                            {stock > 0 ? <><FaCheckCircle size={8}/> Available</> : <><FaExclamationCircle size={8}/> Out of Stock</>}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {activeRes ? (
                        <button onClick={() => confirmDelete(activeRes)} className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                          <FaTrashAlt size={14} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setSelectedBook(matchedBook); setIsModalOpen(true); }}
                          disabled={!canReserve}
                          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${canReserve ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
                        >
                          {stock > 0 ? "Reserve" : "N/A"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal: Create Reservation */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Reserve Material</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Book Selection</p>
                  <p className="text-sm font-bold text-slate-700">{selectedBook?.book_name}</p>
                </div>
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Expected Pickup Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 transition-all" value={reservationData.expected_pickup_date} onChange={(e) => setReservationData({...reservationData, expected_pickup_date: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Remarks (Optional)</label>
                    <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 transition-all min-h-[100px]" placeholder="e.g. I will come in the morning..." value={reservationData.remarks} onChange={(e) => setReservationData({...reservationData, remarks: e.target.value})} />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : "Confirm Reservation"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* NEW: POPUP DELETE MODAL */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8 text-center">
                <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Cancel Reservation?</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide leading-relaxed mb-6">
                  This will release the book back to the hub stock. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Go Back
                  </button>
                  <button onClick={handleFinalDelete} disabled={submitting} className="flex-1 px-6 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={14} /> : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Notification */}
        {notification.show && (
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-5 duration-300 ${notification.type === "success" ? "bg-white border-green-100 text-green-600" : "bg-white border-rose-100 text-rose-600"}`}>
            {notification.type === "success" ? <FaCheckCircle size={18}/> : <FaExclamationCircle size={18}/>}
            <span className="text-[11px] font-black uppercase tracking-wider">{notification.message}</span>
            <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 opacity-40 hover:opacity-100"><FaTimes size={14}/></button>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookReservation;