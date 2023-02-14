import React from 'react'
import { MdMenu } from 'react-icons/md'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
const HomePage = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <header className='h-20 w-full flex flex-row justify-around items-center bg-white border-b-[1px] border-gray-300'>
        {/* This is for the header */}
        <div> <MdMenu className='text-2xl text-gray-600' /> </div>
        <div className='font-thin text-xl'>Ultimate Blog</div>
        <div className='flex items-center space-x-4'>
          <div> <BsBell className='text-2xl text-gray-600' /> </div>
          <div className='bg-gray-500 w-5 h-5 rounded-full'></div>
          <div>
            <button className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-200
             transition hover:border-gray-900 hover:text-gray-900'>
              <div>Write</div>
              <div> <FiEdit /> </div>
            </button>
          </div>
        </div>
      </header>

      {/* This is for the body and sidebar */}
      <section className='grid grid-cols-12 place-items-center w-full h-full'>
        <main className='col-span-8 border-r border-gray-300 h-full w-full'>
          Main Part
        </main>
        <aside className='col-span-4 h-full w-full'>
          {/* This is for sidebar */}
          Side Part
        </aside>
      </section>
    </div>
  )
}

export default HomePage