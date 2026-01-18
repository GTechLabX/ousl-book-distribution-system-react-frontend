import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function Registration() {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [centers, setCenters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // slider state
  const [activeView, setActiveView] = useState("view"); // view | register

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchStudentsAndCenters = async () => {
      try {
        const resStudents = await api.get("/student/");
        const dataStudents = resStudents.data;

        let studentArray = [];
        if (Array.isArray(dataStudents?.message)) {
          studentArray = dataStudents.message;
        } else if (Array.isArray(dataStudents)) {
          studentArray = dataStudents;
        } else if (Array.isArray(dataStudents?.results)) {
          studentArray = dataStudents.results;
        }

        const resCenters = await api.get("/centers/");
        const centerMap = {};
        if (Array.isArray(resCenters.data?.data)) {
          resCenters.data.data.forEach((c) => {
            centerMap[c.id] = c.center_name;
          });
        }

        setStudents(studentArray);
        setCenters(centerMap);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndCenters();
  }, []);

  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const centerName = centers[s.center] || "";

    return (
      String(s.s_no).toLowerCase().includes(q) ||
      String(s.student_name).toLowerCase().includes(q) ||
      String(s.email).toLowerCase().includes(q) ||
      String(s.reg_no).toLowerCase().includes(q) ||
      String(centerName).toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-[#D2D2D2] min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Student Management
      </h1>

      {/* SLIDER TABS */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative bg-white rounded-full shadow overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-blue-500 transition-transform duration-700 ease-in-out ${
              activeView === "register" ? "translate-x-full" : ""
            }`}
          />
          <div className="relative flex">
            <button
              onClick={() => setActiveView("view")}
              className={`w-1/2 py-3 font-semibold z-10 transition ${
                activeView === "view" ? "text-white" : "text-gray-700"
              }`}
            >
              View Students
            </button>
            <button
              onClick={() => setActiveView("register")}
              className={`w-1/2 py-3 font-semibold z-10 transition ${
                activeView === "register" ? "text-white" : "text-gray-700"
              }`}
            >
              Register Student
            </button>
          </div>
        </div>
      </div>

      {/* SLIDING CONTENT */}
      <div className="relative overflow-hidden max-w-6xl mx-auto">
        <div
          className={`flex transition-transform duration-700 ease-in-out ${
            activeView === "register" ? "-translate-x-full" : ""
          }`}
        >
          {/* VIEW STUDENTS */}
          <div className="w-full flex-shrink-0 px-4">
            <div className="max-w-2xl mx-auto mb-6">
              <input
                type="text"
                placeholder="Search by ID, Name, Reg No, Center"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">Student ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Center</th>
                    <th className="px-6 py-3 text-left">Reg No</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{s.s_no}</td>
                        <td className="px-6 py-4">{s.student_name}</td>
                        <td className="px-6 py-4">{s.email}</td>
                        <td className="px-6 py-4">
                          {centers[s.center] || s.center}
                        </td>
                        <td className="px-6 py-4">{s.reg_no}</td>

                        <td className="px-6 py-4 flex gap-3">
                          <button
                            onClick={() => handleEdit(s)}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(s.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* REGISTER STUDENT */}
          <div className="w-full flex-shrink-0 px-4">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">
                Register New Student
              </h2>

              <input
                className="w-full mb-4 px-4 py-2 border rounded"
                placeholder="Student Name"
              />
              <input
                className="w-full mb-4 px-4 py-2 border rounded"
                placeholder="Email"
              />
              <input
                className="w-full mb-4 px-4 py-2 border rounded"
                placeholder="Registration Number"
              />

              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Register Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
