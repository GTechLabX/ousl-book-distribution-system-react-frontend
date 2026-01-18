import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../api/auth";

function Registration() {
  const { user } = useAuth(); // user.token must be present

  const [students, setStudents] = useState([]);
  const [centers, setCenters] = useState({});
  const [districts, setDistricts] = useState([]);
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [activeView, setActiveView] = useState("view"); // view | register
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    student_name: "",
    nic: "",
    s_no: "",
    reg_no: "",
    email: "",
    district: "",
    center: "",
    degree_program: "",
  });

  const hasFetched = useRef(false);

  // =============== FETCH DATA =================
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Token ${user?.token}` };

        // Students
        const resStudents = await api.get("/student/", { headers });
        const studentArray =
          resStudents.data?.message ||
          resStudents.data?.results ||
          resStudents.data ||
          [];

        // Centers
        const resCenters = await api.get("/centers/", { headers });
        const centerMap = {};
        (resCenters.data?.data || []).forEach((c) => {
          centerMap[c.id] = c.center_name;
        });

        // Districts
        const resDistricts = await api.get("/districts/", { headers });
        setDistricts(resDistricts.data?.data || []);

        // Degree Programs
        const resDegrees = await api.get("/degree-programs/", { headers });
        setDegreePrograms(resDegrees.data?.data || []);

        setStudents(studentArray);
        setCenters(centerMap);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user?.token]);

  // =============== FILTER STUDENTS =================
  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s?.student_name?.toLowerCase().includes(q) ||
      s?.reg_no?.toLowerCase().includes(q) ||
      s?.s_no?.toLowerCase().includes(q) ||
      s?.email?.toLowerCase().includes(q) ||
      centers[s?.center]?.toLowerCase().includes(q)
    );
  });

  // =============== HANDLERS =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      student_name: student.student_name || "",
      nic: student.nic || "",
      s_no: student.s_no || "",
      reg_no: student.reg_no || "",
      email: student.email || "",
      district: student.district || "",
      center: student.center || "",
      degree_program: student.degree_program || "",
    });
    setActiveView("register");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      const headers = { Authorization: `Token ${user?.token}` };
      await api.delete(`/student/delete/${id}/`, { headers });
      setStudents((prev) => prev.filter((s) => s?.id !== id));
      setSuccessMsg("Student deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    try {
      const payload = {
        ...formData,
        district: parseInt(formData.district),
        center: parseInt(formData.center),
        degree_program: parseInt(formData.degree_program),
      };
      const headers = { Authorization: `Token ${user?.token}` };

      if (editingStudent) {
        // Update
        const res = await api.put(
          `/student/${editingStudent.id}/update/`,
          payload,
          { headers }
        );
        setStudents((prev) =>
          prev.map((s) =>
            s?.id === editingStudent.id ? res.data || s : s
          )
        );
        setSuccessMsg("Student updated successfully!");
      } else {
        // Register
        const res = await api.post("/student_register/", payload, { headers });
        setStudents((prev) => [
          ...prev,
          res.data?.student_id || {},
        ]);
        setSuccessMsg("Student registered successfully!");
      }

      // Reset form
      setEditingStudent(null);
      setFormData({
        student_name: "",
        nic: "",
        s_no: "",
        reg_no: "",
        email: "",
        district: "",
        center: "",
        degree_program: "",
      });
      setActiveView("view");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(
        "Failed to save student. Make sure all fields are valid and NIC/RegNo are unique."
      );
    }
  };

  const handleSlideToRegister = () => {
    setEditingStudent(null);
    setFormData({
      student_name: "",
      nic: "",
      s_no: "",
      reg_no: "",
      email: "",
      district: "",
      center: "",
      degree_program: "",
    });
    setActiveView("register");
    setSuccessMsg("");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-[#D2D2D2] min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Student Management</h1>

      {successMsg && (
        <div className="text-center mb-4 text-green-700 font-semibold">
          {successMsg}
        </div>
      )}

      {/* Slider Tabs */}
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
              className={`w-1/2 py-3 font-semibold z-10 ${
                activeView === "view" ? "text-white" : "text-gray-700"
              }`}
            >
              View Students
            </button>
            <button
              onClick={handleSlideToRegister}
              className={`w-1/2 py-3 font-semibold z-10 ${
                activeView === "register" ? "text-white" : "text-gray-700"
              }`}
            >
              Register Student
            </button>
          </div>
        </div>
      </div>

      {/* Sliding Content */}
      <div className="relative overflow-hidden max-w-6xl mx-auto">
        <div
          className={`flex transition-transform duration-700 ease-in-out ${
            activeView === "register" ? "-translate-x-full" : ""
          }`}
        >
          {/* VIEW STUDENTS */}
          <div className="w-full flex-shrink-0 px-4">
            <input
              className="w-full mb-4 px-4 py-2 border rounded"
              placeholder="Search by ID, Name, Reg No, Center"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">S No</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Center</th>
                    <th className="p-3">Reg No</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s?.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{s?.s_no || "-"}</td>
                      <td className="p-3">{s?.student_name || "-"}</td>
                      <td className="p-3">{s?.email || "-"}</td>
                      <td className="p-3">{centers[s?.center] || "-"}</td>
                      <td className="p-3">{s?.reg_no || "-"}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s?.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* REGISTER / EDIT STUDENT */}
          <div className="w-full flex-shrink-0 px-4">
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto bg-white p-6 rounded shadow"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingStudent ? "Edit Student" : "Register Student"}
              </h2>

              {[["student_name", "Student Name"], ["nic", "NIC"], ["s_no", "Student No"], ["reg_no", "Registration No"], ["email", "Email"]].map(
                ([name, label]) => (
                  <input
                    key={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={label}
                    className="w-full mb-3 px-4 py-2 border rounded"
                    required
                  />
                )
              )}

              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-2 border rounded"
                required
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.district_name}
                  </option>
                ))}
              </select>

              <select
                name="center"
                value={formData.center}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-2 border rounded"
                required
              >
                <option value="">Select Center</option>
                {Object.entries(centers).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                name="degree_program"
                value={formData.degree_program}
                onChange={handleChange}
                className="w-full mb-4 px-4 py-2 border rounded"
                required
              >
                <option value="">Select Degree Program</option>
                {degreePrograms.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.d_program}
                  </option>
                ))}
              </select>

              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                {editingStudent ? "Update Student" : "Register Student"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
