import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Side Panel/Header'
import Menu from '../Side Panel/Menu'
import Footer from '../Side Panel/Footer'



function Layout() {
  return (
    <div className='flex flex-row h-screen  '>
        <div className='w-1/5 bg-[#0c4187] flex flex-col justify-between  '>
          <div className=' w-full h-1/5   '>
            <Header />
          </div>
          <div className='w-full h-3/5'>
            <Menu />
          </div>
          <div className='w-full h-1/5 '>
            <Footer />
          </div>
        </div>

        <div className='flex-1 hscreen'> 
            <Outlet />
        </div>



    </div>
  )
}

export default Layout