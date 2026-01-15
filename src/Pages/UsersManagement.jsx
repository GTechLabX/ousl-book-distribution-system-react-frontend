import React, { useState, useRef } from "react";

function UsersManagment() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  
    // Course search state
    const [searchQuery, setSearchQuery] = useState('');
    const [registeredCourses, setRegisteredCourses] = useState([]);

    

  const [course, setCourse] = useState({
    code: "",
    username: "",
    position: "",
    center: "",
    password: ""
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
    username: "",
    position: "",
    center: "",
    password: ""
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // nothing extra needed, filteredCourses handles display
  };

  // Filter courses based on searchQuery
  const filteredCourses = registeredCourses.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.code.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-[#D2D2D2] h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold text-[#070055] bg-[#878788] h-16 text-center p-2">
        Users Management
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
              <label className="font-medium">User ID</label>
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
              <label className="font-medium">User Name</label>
              <input
                type="text"
                name="username"
                value={course.username}
                onChange={handleChange}
                className="h-8 w-full col-span-2 bg-white px-4 rounded-xl"
                required
              />
            </div>

            {/* Position */}
           <div className="grid grid-cols-3 items-center gap-0">
           <label className="font-medium">Position</label>

       <select
        name="position"
        value={course.position}
        onChange={handleChange}
        className="h-8 w-full col-span-0 bg-white px-4 rounded-xl"
       >
    <option value="">-- Select Position --</option>
    <option value="Manager">Manager</option>
    <option value="Assistant Manager">Assistant Manager</option>
    <option value="Officer">Officer</option>
    <option value="Clerk">Clerk</option>
    <option value="Lecturer">Lecturer</option>
  </select>
  </div>


            {/* Faculty */}
            <div className="grid grid-cols-3 items-center gap-0">
              <label className="font-medium">Center</label>
              <input
                type="text"
                name="center"
                value={course.center}
                onChange={handleChange}
                className="h-8 w-full col-span-0 bg-white px-4 rounded-xl"
              />
            </div>

            {/* Credits */}
            <div className="grid grid-cols-3 items-center gap-0">
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={course.password}
                onChange={handleChange}
                className="h-8 w-full col-span-0 bg-white px-4 rounded-xl"
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
        <h2 className="text-center text-xl font-bold  text-[#070055] mb-4">Users</h2>

        <div className="flex justify-start ml-0 mt-8">
    <div className="relative w-full max-w-xl">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="ID /  Name"
      className="w-full px-4 py-3 pr-24 bg-[#F4F4F4] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={handleSearch}
      className="absolute right-1 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#070055] text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Search
    </button>
  </div>
</div>
<br />

        <div className="bg-[#E5E7EB] p-3 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#F3F4F6] text-left text-sm font-medium">
                <th className="px-4 py-2">code</th>
                <th className="px-4 py-2">username</th>
                <th className="px-4 py-2">position</th>
                <th className="px-4 py-2">center</th>
                <th className="px-4 py-2">password</th>

              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No courses added
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c.id} className="border-t text-sm">
                    <td className="px-4 py-2">{c.code}</td>
                    <td className="px-4 py-2">{c.username}</td>
                    <td className="px-4 py-2">{c.position}</td>
                    <td className="px-4 py-2">{c.center}</td>
                    <td className="px-4 py-2">####</td>

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

export default UsersManagment;
