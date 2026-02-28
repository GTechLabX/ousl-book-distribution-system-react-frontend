import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBook, FaBox, FaHistory, FaTimes } from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function Inventory() {
  const { user } = useAuth();

  // State
  const [books, setBooks] = useState([]); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    printed_quantity: "",
    left_quantity: "",
    description: ""
  });

  useEffect(() => {
    fetchInventory();
    fetchCourses();
  }, []);

  // Fetch All Books - http://127.0.0.1:8000/api/books/
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/books/", {
        headers: { Authorization: `Bearer ${user?.access}` }
      });
      // Accessing res.data.data because of your API structure
      const data = res.data.success ? res.data.data : [];
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Assuming courses come from a similar endpoint, or update this to your specific course API
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/", {
        headers: { Authorization: `Bearer ${user?.access}` }
      });
      const data = res.data.success ? res.data.data : res.data;
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

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
      let res;
      if (currentBook) {
        // UPDATE - http://127.0.0.1:8000/api/book/update/1/
        res = await api.put(`/book/update/${currentBook.id}/`, formData, {
          headers: { Authorization: `Bearer ${user?.access}` }
        });
      } else {
        // ADD - http://127.0.0.1:8000/api/book/add/
        res = await api.post("/book/add/", formData, {
          headers: { Authorization: `Bearer ${user?.access}` }
        });
      }

      if (res.data.success) {
        setShowModal(false);
        fetchInventory();
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      alert("Action failed. Please check your data.");
    }
  };

  // DELETE - http://127.0.0.1:8000/api/book/delete/1/
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const res = await api.delete(`/book/delete/${id}/`, {
          headers: { Authorization: `Bearer ${user?.access}` }
        });
        if (res.data.success) {
          fetchInventory();
        }
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const filteredBooks = books.filter((b) => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Inventory Management</h1>
            <p className="text-gray-500 text-sm">Main stock control and course material registry</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition shadow-lg active:scale-95"
          >
            <FaPlus /> Add New Book
          </button>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-lg text-blue-600"><FaBook size={24} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Total Titles</p>
              <p className="text-2xl font-black text-gray-800">{filteredBooks.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="bg-green-50 p-4 rounded-lg text-green-600"><FaBox size={24} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Stock Available</p>
              <p className="text-2xl font-black text-gray-800">
                {filteredBooks.reduce((acc, b) => acc + (parseInt(b.left_quantity) || 0), 0)}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="bg-purple-50 p-4 rounded-lg text-purple-600"><FaHistory size={24} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Lifetime Printed</p>
              <p className="text-2xl font-black text-gray-800">
                {filteredBooks.reduce((acc, b) => acc + (parseInt(b.printed_quantity) || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Book Name</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Course ID</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Printed</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20 text-gray-400 italic">Syncing with database...</td></tr>
              ) : filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-700">{book.name}</td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-sm"># {book.course}</td>
                  <td className="py-4 px-6 text-gray-600">{book.printed_quantity}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${book.left_quantity < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                      <span className="font-bold text-gray-700">{book.left_quantity}</span>
                      <span className="text-xs text-gray-400">Left</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(book)} className="text-blue-600 p-2 hover:bg-blue-100 rounded-lg transition-colors"><FaEdit size={16}/></button>
                      <button onClick={() => handleDelete(book.id)} className="text-red-600 p-2 hover:bg-red-100 rounded-lg transition-colors"><FaTrash size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{currentBook ? "Edit Stock Item" : "New Inventory Entry"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTimes size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Book Name</label>
                <input
                  placeholder="Official book title"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Assign to Course</label>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Printed Qty</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.printed_quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData, 
                        printed_quantity: val, 
                        left_quantity: currentBook ? formData.left_quantity : val 
                      });
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Left in Stock</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.left_quantity}
                    onChange={(e) => setFormData({...formData, left_quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Notes / Description</label>
                <textarea
                  placeholder="Edition, Author or location info..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 transition"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition"
                >
                  {currentBook ? "Save Changes" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;