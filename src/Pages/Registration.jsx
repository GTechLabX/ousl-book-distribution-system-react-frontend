import React, { useState } from 'react';

function Registration() {
  // Student input state (optional)
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [center, setCenter] = useState('');

  // Course search state
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredCourses, setRegisteredCourses] = useState([]);

  // Courses data
  const [courses] = useState([
    { id: 1, code: 'AGM3263', name: 'Communication Skills', program: 'BSE', credits: 2 },
    { id: 2, code: 'EEI3372', name: 'Programing python', program: 'BSE', credits: 3 },
    { id: 3, code: 'EEI4267', name: 'Requirement Engineering', program: 'BSE', credits: 2 },
    { id: 4, code: 'EEI4346', name: 'Web Technology', program: 'BSE', credits: 3 },
    { id: 5, code: 'EEI4362', name: 'Object Oriented Design', program: 'BSE', credits: 3 },
    { id: 6, code: 'MHZ4256', name: 'Mathamatics for Computing', program: 'MP', credits: 2 },
  ]);

  // Handle course registration
  const handleRegister = (courseId) => {
  const course = courses.find(c => c.id === courseId);
  if (course && !registeredCourses.find(rc => rc.id === courseId)) {
    setRegisteredCourses([...registeredCourses, course]);
  }
};


  // Filter courses based on search
  const filteredCourses = courses.filter(course => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return course.code.toLowerCase().includes(query) || course.name.toLowerCase().includes(query);
  });

  return (
    <div className="bg-[#D2D2D2] h-screen overflow-y-auto ">
      {/* Student Registration Form */}
      <h1 className="text-2xl font-bold text-[#05003C] bg-[#878788] h-15 text-center p-2">
        Student Registration
      </h1>
      <div className='  '>
      <form className="max-w-xl mx-auto mt-10 ml-30 space-y-3">

          <div className="grid grid-cols-3 items-center gap-6">
          <label className="col-span-1 text-left font-medium">
          Student ID
          </label>
           
          <input
          type="text"
          className="field-sizing-fixed h-8 w-150 col-span-2 bg-white px-4 py-2 rounded-xl  "/>
          </div>

           <div className="grid grid-cols-3 gap-6 items-center">
          <label className="col-span-1 text-left font-medium">
            Student Name
           </label>
           <input
          type="text"
          className=" field-sizing-fixed h-8 w-150 col-span-2 bg-white px-4 py-2 rounded-xl  "/>
         </div>

         <div className="grid grid-cols-3 gap-6 items-center">
          <label className="col-span-1 text-left font-medium">
          Student Email
          </label>
          <input
          type="email"
          className=" field-sizing-fixed h-8 w-150 col-span-2 bg-white px-4 py-2 rounded-xl  "/>
         </div>

         <div className="grid grid-cols-3 gap-6 items-center">
          <label className="col-span-1 text-left font-medium">
           Center
         </label>
          <input
          type="text"
          className="field-sizing-fixed h-8 w-150 col-span-2 bg-white px-4 py-2 rounded-xl  "/>
         </div>
         


      </form>
       </div>

      {/* Course Search & Registration */}
      <div className=" p-2 bg-[#BEC4C8] max-w-4xl mx-auto mt-16 rounded-xl">
        <h2 className=" text-center text-xl font-bold  mb-6">Search Course</h2>
        <form className="mb-8" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Course Code / Course Name"
              className=" bg-[#F4F4F4] flex-grow max-w-xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#070055] text-white font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </form>

        {/* Courses Table */}
        <div className=" p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Program</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Credits</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No courses found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {course.credits} credits
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRegister(course.id)}
                        disabled={registeredCourses.find(rc => rc.id === course.id)}
                        className={`px-4 py-2 rounded-md ${
                          registeredCourses.find(rc => rc.id === course.id)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#070055] text-white '
                        }`}
                      >
                        {registeredCourses.find(rc => rc.id === course.id) ? 'Added' : 'Add'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registered Courses */}
{registeredCourses.length > 0 && (
  <div className="p-6 bg-[#BEC4C8] max-w-4xl mx-auto mt-16 rounded-xl">
    <h2 className="text-center text-xl font-bold mb-4">
      Courses
    </h2>

    <div className="bg-[#E5E7EB] p-3 ">
      <table className="min-w-full ">
        <thead>
          <tr className="bg-[#F3F4F6] text-left text-sm font-medium">
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Program</th>
            <th className="px-4 py-2">Credits</th>
          </tr>
        </thead>
        <tbody>
          {registeredCourses.map((course) => (
            <tr
              key={course.id}
              className="border-t border-gray-300 text-sm"
            >
              <td className="px-4 py-2">{course.code}</td>
              <td className="px-4 py-2">{course.name}</td>
              <td className="px-4 py-2">{course.program}</td>
              <td className="px-4 py-2">{course.credits}</td>
            </tr>
          ))}
        </tbody>
        
      </table>
      <div className='w-full  p-2 bg-[#A8A8A8] flex justify-end rounded-xl '>
          <button
              type="submit"
              className="px-7 py-2 bg-[#070055] text-white font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
        </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Registration;
