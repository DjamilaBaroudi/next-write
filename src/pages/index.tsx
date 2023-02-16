import React from 'react'
import { MdMenu } from 'react-icons/md'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { CiSearch } from 'react-icons/ci'
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
          <div className='flex flex-col space-y-4 w-full p-10'>
            <div className='flex space-x-4 items-center w-full'>
              <label htmlFor="search" className='relative w-full border-gray-300 border rounded'>
                <div className='absolute left-2 h-full flex items-center'>
                  <CiSearch />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className='outline-none  py-1 px-4 pl-8
                  text-sm placeholder:text-xs placeholder:text-gray-300'
                  placeholder='Search...' />
              </label>
              <div className='flex items-center w-full'>
                <div>topics: </div>
                <div className='flex space-x-2 items-center'>
                  {
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className='rounded-3xl bg-gray-200/50 p-4'>tag {index} </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
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