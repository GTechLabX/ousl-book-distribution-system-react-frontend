import React, { useState, useEffect } from "react";
import { 
  FaSearch, FaBookmark, FaCalendarCheck, 
  FaMapMarkerAlt, FaExclamationTriangle, FaPhoneAlt, FaWarehouse, FaHistory 
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function BookReservation() {
  const { user } = useAuth();
  
  // Data States
  const [centers, setCenters] = useState([]);
  const [books, setBooks] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState("");

  // 1. Load Centers and User Reservations on Mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [centersRes, resRes] = await Promise.all([
          api.get("/centers/"),
          api.get("/book-reservations/")
        ]);
        setCenters(centersRes.data.success ? centersRes.data.data : []);
        setMyReservations(resRes.data.success ? resRes.data.data : []);
      } catch (err) {
        console.error("Initial fetch error:", err);
      }
    };
    if (user) fetchInitialData();
  }, [user]);

  // 2. Fetch books based on selected center
  useEffect(() => {
    if (selectedCenterId) {
      fetchCenterInventory(selectedCenterId);
    } else {
      setBooks([]);
    }
  }, [selectedCenterId]);

  const fetchCenterInventory = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/center-books/?center_id=${id}`);
      // Mapping based on your JSON structure: "book_name", "allocation_quantity"
      setBooks(res.data.success ? res.data.data : []);
    } catch (err) {
      console.error("Inventory error:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Reservation (Saves as PENDING in DB)
  const handleReserve = async (bookId) => {
    if (!selectedCenterId) return alert("Please select a center.");
    if (!window.confirm("Confirm reservation request?")) return;

    try {
      const payload = {
        book: bookId,
        center: selectedCenterId,
        status: "PENDING"
      };

      const res = await api.post("/book-reservation/add/", payload);

      if (res.status === 201 || res.data.success) {
        alert("✅ Request sent! Waiting for center approval.");
        // Refresh everything
        fetchCenterInventory(selectedCenterId);
        const resUpdate = await api.get("/book-reservations/");
        setMyReservations(resUpdate.data.success ? resUpdate.data.data : []);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Check your existing reservations."));
    }
  };

  // Safe Filtering Logic (prevents toLowerCase crash)
  const filteredBooks = books.filter(b => 
    (b.book_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.center_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCenter = centers.find(c => c.id === parseInt(selectedCenterId));

  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FaWarehouse className="text-[#0c4187]" /> Regional Dispatch
          </h1>
          <p className="text-gray-500 font-medium">Reserve available books from your local center.</p>
        </div>

        {/* Selection Controls */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">1. Select Center</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
              <select 
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={selectedCenterId}
                onChange={(e) => setSelectedCenterId(e.target.value)}
              >
                <option value="">-- Choose Center --</option>
                {centers.map(c => <option key={c.id} value={c.id}>{c.c_name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">2. Filter Books</label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                disabled={!selectedCenterId}
                type="text"
                placeholder="Search by book name..."
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-medium outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List View */}
        <div className="space-y-4">
          {!selectedCenterId ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest">
              Please choose a center to view available books
            </div>
          ) : loading ? (
            <div className="text-center py-20 animate-pulse text-gray-400 italic">Syncing inventory...</div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="p-4 bg-blue-50 text-[#0c4187] rounded-2xl group-hover:bg-[#0c4187] group-hover:text-white transition-colors">
                    <FaBookmark />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{book.book_name}</h3>
                    <p className="text-xs text-gray-400 font-medium uppercase mt-1">Available at {book.center_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase">Stock</p>
                    <p className={`font-black ${book.allocation_quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {book.allocation_quantity}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleReserve(book.books)} // Using book ID from your JSON
                    disabled={book.allocation_quantity <= 0}
                    className="flex-grow md:flex-initial px-8 py-3 bg-[#0c4187] text-white rounded-2xl font-black text-xs tracking-widest hover:bg-black transition-all disabled:bg-gray-100 disabled:text-gray-300"
                  >
                    RESERVE
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">No books found matching your search.</div>
          )}
        </div>

        {/* Reservation History Section */}
        {myReservations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <FaHistory className="text-blue-600" /> My Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReservations.map(res => (
                <div key={res.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-700 text-sm">{res.book_name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{res.status}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    res.approved ? "bg-green-50 text-green-500 border-green-100" : "bg-orange-50 text-orange-500 border-orange-100"
                  }`}>
                    {res.approved ? "Approved" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookReservation;