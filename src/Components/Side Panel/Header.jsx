import React from 'react'

function Header() {
  return (
    <div className='w-full h-full bg-bg-[#0c4187] flex flex-col items-left justify-top p-4 gap-2'>
        
        <div className='flex flex-col items-center'>
            <h2 className='text-5xl font-bold text-white '>OUSL</h2>
            <h4 className='text-2xl font-bold text-white '>Dispatch</h4>
        </div>
        <div className='flex flex-row items-center mt- gap-3'>
            {/* <img className='w-8 h-8 rounded-full' src="" alt="" /> */}
            <p className='text-md font-bold text-white '>Hello Username</p>
        </div>
    </div>
  )
}

export default Header