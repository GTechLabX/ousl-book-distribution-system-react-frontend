import React from 'react'

function Footer() {
  return (
    <div className='w-full h-full bg-[#0c4187] flex flex-col items-center justify-center p-2 gap-2'>
        <button
            // onClick={onLogout}
            className="w-[130px] bg-gray-100 text-black py-1.5 rounded-md align-center text-bold "
            type="button"
          >
        Log out
      </button>

        <p className='text-white'>Developed by Group progect</p>
        <p className='text-white'>Version  1.0s</p>
      
    </div>
  )
}

export default Footer
