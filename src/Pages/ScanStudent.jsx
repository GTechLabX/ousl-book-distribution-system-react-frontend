import React, { useState } from "react";
import { FaQrcode, FaBook, FaCheckCircle } from "react-icons/fa";

function ScanStudent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Dummy students
  const dummyStudents = [
    {
      id: 1,
      student_name: "Kamal Gonsan",
      reg_no: "REG2024ENG001",
      s_no: "S001",
      email: "kamal@ousl.lk",
      courses: [
        { code: "CS101", name: "Computer Science I", year: "2024", issued: false },
        { code: "MATH201", name: "Advanced Mathematics", year: "2024", issued: false },
      ],
    },
    {
      id: 2,
      student_name: "Dinusantha SDGS",
      reg_no: "REG2024ENG002",
      s_no: "S002",
      email: "dinusantha@ousl.lk",
      courses: [
        { code: "ENG101", name: "English Language", year: "2024", issued: true },
        { code: "PHY101", name: "Physics I", year: "2024", issued: true },
      ],
    },
  ];

  const handleSearch = () => {
    const found = dummyStudents.find(
      (s) =>
        s.reg_no.toLowerCase() === searchQuery.toLowerCase() ||
        s.s_no.toLowerCase() === searchQuery.toLowerCase()
    );

    if (found) {
      setStudent(found);
      setScanned(true);
    } else {
      alert("Student not found!");
      setStudent(null);
      setScanned(false);
    }
  };

  const handleIssueCourse = (index) => {
    const newStudent = { ...student };
    newStudent.courses[index].issued = true;
    setStudent(newStudent);
    alert(`Printed material issued for ${newStudent.courses[index].code}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Scan / Lookup Student
      </h1>

      {/* Search / Scan Box */}
      <div className="max-w-xl mx-auto mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Enter Student No or Reg No"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 font-semibold shadow"
        >
          <FaQrcode /> Scan
        </button>
      </div>

      {/* Student Details */}
      {student && (
        <div
          className={`max-w-5xl mx-auto bg-white rounded shadow-lg p-6 mb-6 border-l-4 ${
            scanned ? "border-green-500 animate-pulse" : "border-blue-500"
          }`}
        >
          {/* Scan Status */}
          {scanned && (
            <div className="flex items-center gap-2 mb-4 text-green-600 font-semibold">
              <FaCheckCircle /> Student Scanned
            </div>
          )}

          {/* Student Info */}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Student Details
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold text-gray-600">Name:</p>
              <p className="text-gray-800">{student.student_name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Student No:</p>
              <p className="text-gray-800">{student.s_no}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Reg No:</p>
              <p className="text-gray-800">{student.reg_no}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Email:</p>
              <p className="text-gray-800">{student.email}</p>
            </div>
          </div>

          {/* Courses Table */}
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Registered Courses (This Year)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left border-b">Course Code</th>
                  <th className="p-3 text-left border-b">Course Name</th>
                  <th className="p-3 text-left border-b">Year</th>
                  <th className="p-3 text-left border-b">Printed Material</th>
                </tr>
              </thead>
              <tbody>
                {student.courses.map((c, index) => (
                  <tr key={c.code} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{c.code}</td>
                    <td className="p-3 border-b">{c.name}</td>
                    <td className="p-3 border-b">{c.year}</td>
                    <td className="p-3 border-b">
                      <button
                        disabled={c.issued}
                        onClick={() => handleIssueCourse(index)}
                        className={`px-3 py-1 rounded font-semibold transition ${
                          c.issued
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {c.issued ? "Issued ✅" : "Issue"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScanStudent;
