import React from 'react'

function CourseManagement() {
  return (
   
    <div className="bg-[#D2D2D2]  h-screen overflow-y-auto">
      
      <h1 className="text-2xl font-bold text-[#05003C] bg-[#878788] h-15 text-center p-2">
        Course management
      </h1><br />

      <div className='w-full  p-2 bg-[#BEC4C8] flex justify-end rounded-xl '>
          <button
              type="submit"
              className="px-7 py-2 bg-[#070055] text-white font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
        </div>
    </div>
    
  )
}

export default CourseManagement