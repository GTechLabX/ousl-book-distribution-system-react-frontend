import React, { useState, useRef } from "react";

function CourseManagement() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const [registeredCourses, setRegisteredCourses] = useState([]);

  const [course, setCourse] = useState({
    code: "",
    name: "",
    program: "",
    faculty: "",
    credits: ""
  });

  const handleAddNew = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setRegisteredCourses((prev) => [
      ...prev,
      { id: Date.now(), ...course }
    ]);

    setCourse({
      code: "",
      name: "",
      program: "",
      faculty: "",
      credits: ""
    });
  };

  return (
    <div className="bg-[#D2D2D2] h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#05003C] bg-[#878788] h-16 text-center p-2">
        Course Management
      </h1>

      {/* Add New Button */}
      <div className="rounded-xl max-w-4xl mx-auto mt-5 p-4 bg-[#BEC4C8] justify-start ">
        <button
          onClick={handleAddNew}
          className="font-bold p-4 px-9 bg-[#EAEAEA] text-[#070055] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          ref={formRef}
          className="p-4 bg-[#BEC4C8] max-w-4xl mx-auto mt-10 rounded-xl  "
        >
          <h2 className="text-xl font-bold text-[#070055] text-center ml-50 ">
            Add New Course
          </h2>

          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mt-10 space-y-4"
          >
            {/* Course Code */}
            <div className="grid grid-cols-3 items-center gap-0">
              <label className="font-medium">Course Code</label>
              <input
                type="text"
                name="code"
                value={course.code}
                onChange={handleChange}
                className="h-8 w-full col-span-2 bg-white px-4 rounded-xl"
                required
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-3 items-center gap-0">
              <label className="font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={course.name}
                onChange={handleChange}
                className="h-8 w-full col-span-2 bg-white px-4 rounded-xl"
                required
              />
            </div>

            {/* Program */}
            <div className="grid grid-cols-3 items-center gap-0">
              <label className="font-medium">Program</label>
              <input
                type="text"
                name="program"
                value={course.program}
                onChange={handleChange}
                className="h-8 w-full col-span-2 bg-white px-4 rounded-xl"
              />
            </div>

            {/* Faculty */}
            <div className="grid grid-cols-3 items-center gap-0">
              <label className="font-medium">Faculty</label>
              <input
                type="text"
                name="faculty"
                value={course.faculty}
                onChange={handleChange}
                className="h-8 w-full col-span-2 bg-white px-4 rounded-xl"
              />
            </div>

            {/* Credits */}
            <div className="grid grid-cols-3 items-center gap-0">
              <label className="font-medium">Credits</label>
              <input
                type="number"
                name="credits"
                value={course.credits}
                onChange={handleChange}
                className="h-8 w-full col-span-2 bg-white px-4 rounded-xl"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-7 py-2 bg-[#070055] text-white font-medium rounded-lg ml-50"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="p-6 bg-[#BEC4C8] max-w-4xl mx-auto mt-16 rounded-xl">
        <h2 className="text-center text-xl font-bold  text-[#070055] mb-4">Courses</h2>

        <div className="bg-[#E5E7EB] p-3 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#F3F4F6] text-left text-sm font-medium">
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Program</th>
                <th className="px-4 py-2">Faculty</th>
                <th className="px-4 py-2">Credits</th>

              </tr>
            </thead>
            <tbody>
              {registeredCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No courses added
                  </td>
                </tr>
              ) : (
                registeredCourses.map((c) => (
                  <tr key={c.id} className="border-t text-sm">
                    <td className="px-4 py-2">{c.code}</td>
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.program}</td>
                    <td className="px-4 py-2">{c.faculty}</td>
                    <td className="px-4 py-2">{c.credits}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseManagement;
