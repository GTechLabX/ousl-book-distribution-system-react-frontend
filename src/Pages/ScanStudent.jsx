import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle, FaQrcode, FaSearch, FaTimes, FaLock } from "react-icons/fa";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2"; // Added for professional notifications and modals
import api from "../api/axios";
import { useAuth } from "../api/auth";

function ScanStudent() {
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState(null);

  // Refs
  const scannerRef = useRef(null);
  const isProcessing = useRef(false);

  // Toast Configuration
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getCurrentTime = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

  const getStudentIdFromQr = (qrText) => {
    if (!qrText) return "";
    const match = qrText.match(/INC-ID:\s*([\w-]+)/i);
    return match ? match[1] : qrText.trim();
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Scanner cleanup warning:", err);
      } finally {
        scannerRef.current = null;
        setShowScanner(false);
      }
    }
  };

  const fetchStudent = async (qrText) => {
    if (isProcessing.current) return;

    const studentId = getStudentIdFromQr(qrText);
    if (!studentId) return;

    isProcessing.current = true;
    setLoading(true);
    setScanError(null);

    try {
      const res = await api.post(
        "/scan-qr/",
        { qr_text: studentId },
        { headers: { Authorization: `Bearer ${user?.access}` } }
      );

      if (res.data.success) {
        const s = res.data.student;

        const courses = (s.enrolled_courses || []).map((c) => ({
          id: c.id,
          code: c.course_code,
          name: c.name,
          year: c.register_year,
          issued: c.is_received === true || !!c.issued_date, 
          issued_date: c.issued_date || null,
          issued_time: c.issued_time || null,
        }));

        setStudent({ ...s, courses });
        setScanned(true);
        setSearchQuery(""); 
        await stopScanner();
        Toast.fire({ icon: 'success', title: 'Student records loaded' });
      } else {
        throw new Error(res.data.error || "Student not found");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid Student ID or QR Code";
      setScanError(msg);
      setStudent(null);
      setScanned(false);
    } finally {
      setLoading(false);
      setTimeout(() => { isProcessing.current = false; }, 2000);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    fetchStudent(searchQuery.trim());
  };

  useEffect(() => {
    if (showScanner) {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => { if (!isProcessing.current) fetchStudent(decodedText); },
        () => {}
      ).catch((err) => {
        setScanError("Could not access camera.");
        setShowScanner(false);
      });
    }
    return () => { if (scannerRef.current) stopScanner(); };
  }, [showScanner]);

  const handleIssueCourse = async (index) => {
    const course = student.courses[index];
    
    // "ARE YOU SURE?" MODAL
    const result = await Swal.fire({
      title: 'Confirm Dispatch',
      text: `Are you sure you want to issue ${course.name} (${course.code}) to this student?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', // blue-600
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText: 'Yes, Issue Material',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    if (!user?.uuid) return Toast.fire({ icon: 'error', title: 'Admin ID missing' });

    setLoading(true);
    setScanError(null);

    try {
      const payload = {
        admin_uuid: user.uuid,
        student_nic: student.nic,
        book_id: course.id,
        course_ids: [course.id],
      };

      const res = await api.post("/issue-book/", payload, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      if (res.data.success) {
        const updatedStudent = { ...student };
        updatedStudent.courses[index] = {
          ...course,
          issued: true,
          issued_date: res.data.data?.date || getTodayDate(),
          issued_time: res.data.data?.time || getCurrentTime(),
        };
        setStudent(updatedStudent);
        
        // SUCCESS NOTIFICATION
        Swal.fire({
          icon: 'success',
          title: 'Issued!',
          text: 'The material has been successfully dispatched.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        setScanError(res.data.error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setScanError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Student Material Dispatch
      </h1>

      {/* Lookup Bar */}
      <div className="max-w-2xl mx-auto mb-8 flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Enter Student NIC / Reg No"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold shadow disabled:bg-blue-300"
        >
          <FaSearch /> Lookup
        </button>
        <button
          onClick={() => { setScanError(null); setShowScanner(!showScanner); }}
          className={`px-6 py-3 text-white rounded-lg transition flex items-center gap-2 font-semibold shadow ${
            showScanner ? "bg-red-500 hover:bg-red-600" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {showScanner ? <FaTimes /> : <FaQrcode />}
          {showScanner ? "Close" : "Scan QR"}
        </button>
      </div>

      {showScanner && (
        <div className="max-w-md mx-auto mb-8 overflow-hidden rounded-xl border-4 border-purple-200 shadow-2xl bg-white p-2">
          <div id="reader"></div>
          <p className="text-center py-2 text-sm text-gray-500">Align QR code within the frame</p>
        </div>
      )}

      {/* ERROR ALERT BOX */}
      {scanError && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm flex justify-between items-center animate-pulse">
          <span className="font-medium">Error: {scanError}</span>
          <button onClick={() => setScanError(null)} className="text-red-900 font-bold hover:scale-110">×</button>
        </div>
      )}

      {student && (
        <div className={`max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden mb-10 border-t-8 ${scanned ? "border-green-500" : "border-blue-600"}`}>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">{student.student_name}</h2>
                <p className="text-blue-600 font-medium">{student.degree_program}</p>
              </div>
              {scanned && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  <FaCheckCircle /> SCANNED
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg mb-8">
              <div><p className="text-xs uppercase text-gray-500 font-bold">NIC Number</p><p className="font-semibold text-gray-800">{student.nic}</p></div>
              <div><p className="text-xs uppercase text-gray-500 font-bold">Student No</p><p className="font-semibold text-gray-800">{student.s_no || "N/A"}</p></div>
              <div><p className="text-xs uppercase text-gray-500 font-bold">Registration No</p><p className="font-semibold text-gray-800">{student.reg_no || "N/A"}</p></div>
              <div><p className="text-xs uppercase text-gray-500 font-bold">Center</p><p className="font-semibold text-gray-800">{student.center}</p></div>
              <div><p className="text-xs uppercase text-gray-500 font-bold">District</p><p className="font-semibold text-gray-800">{student.district}</p></div>
              <div><p className="text-xs uppercase text-gray-500 font-bold">Email</p><p className="font-semibold text-gray-800 truncate">{student.email}</p></div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Enrolled Courses & Materials</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm uppercase">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Course Name</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {student.courses.map((c, index) => (
                    <tr key={c.id || index} className="hover:bg-blue-50 transition">
                      <td className="py-4 px-4 font-mono font-bold text-gray-700">{c.code}</td>
                      <td className="py-4 px-4 text-gray-800">{c.name}</td>
                      <td className="py-4 px-4 text-gray-600">{c.year}</td>
                      <td className="py-4 px-4">
                        {c.issued ? (
                          <div className="bg-red-50 border border-red-200 p-2 rounded text-center shadow-sm">
                            <span className="text-red-700 font-bold block text-sm flex items-center justify-center gap-1">
                              <FaLock className="text-[10px]" /> ALREADY ISSUED
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {c.issued_date} | {c.issued_time}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleIssueCourse(index)}
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-bold shadow-sm transition transform active:scale-95 disabled:bg-gray-300"
                          >
                            {loading ? "Processing..." : "Issue Now"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {loading && !student && (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Processing student data...</p>
        </div>
      )}
    </div>
  );
}

export default ScanStudent;