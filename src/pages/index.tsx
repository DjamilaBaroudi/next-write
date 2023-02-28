/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import MainLayout from '../layouts/MainLayout'
import WriteFormModal from '../components/WriteFormModal'
import { api } from '../utils/api'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Image from 'next/image'
const HomePage = () => {
  const getPosts = api.post.getPosts.useQuery();
  return (
    <MainLayout>
      {/* This is for the body and sidebar */}
      <section className='grid grid-cols-12 place-items-center w-full h-full'>
        <main className='col-span-8 border-r border-gray-300 h-full w-full px-24'>
          <div className='flex flex-col space-y-4 w-full py-10'>
            <div className='flex space-x-4 items-center w-full'>
              <label htmlFor="search" className='relative w-full border-gray-800 border rounded-3xl'>
                <div className='absolute left-2 h-full flex items-center'>
                  <CiSearch />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className='outline-none py-1 px-4 pl-7 ml-2 my-0.5 text-sm placeholder:text-xs placeholder:text-gray-300'
                  placeholder='Search...' />
              </label>
              <div className='flex items-center w-full space-x-4 justify-end'>
                <div>topics: </div>
                <div className='flex space-x-2 items-center'>
                  {
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className='rounded-3xl bg-gray-200/50 px-4 py-3'>tag {index} </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className='w-full justify-between flex items-center border-b pb-8 border-gray-300'>
              <div> Articles </div>
              <div>
                <button className='flex font-semibold space-x-2 items-center border border-gray-800 rounded-3xl px-4 py-1.5'>
                  <div> Following </div>
                  <div className=' h-full flex items-center'> <HiChevronDown className='text-xl' /> </div>
                </button>
              </div>

            </div>
          </div>
          <div className='flex flex-col justify-center space-y-4 w-full'>
            {getPosts.isLoading && <div className='w-full h-full flex items-center justify-center space-x-4'>
              <div>
                <AiOutlineLoading3Quarters size={'1rem'} color={'#5F2AF0'} className='animate-spin' />
              </div>
              <div>
                Loading...
              </div>

            </div>}
            {getPosts.isSuccess && getPosts.data.map((post) => (
              < div key={post.id} className='flex flex-col group space-y-8 pb-8 border-b border-gray-300 last:border-none'>
                <div className='flex w-full space-x-2 items-center'>
                  <div className='rounded-full relative bg-gray-400 h-10 w-10'>
                    {post.author.image &&
                      <Image
                        src={post.author.image}
                        alt={post.author.name ?? ''}
                        fill
                        className='rounded-full'
                      />}
                  </div>
                  <div className='flex flex-col w-full'>
                    <p className='font-semibold'>{post.author.name} &#x2022;
                      <span className='mx-1'>
                        {post.created_at.toDateString()}
                      </span>
                    </p>
                    <p className='text-sm'>Frontend Developer, learner & dreamer</p>
                  </div>
                </div>
                <div className='grid grid-cols-12 w-full min-h-[6rem] gap-4'>
                  <div className='col-span-8 flex flex-col space-y-4'>
                    <p className='text-2xl font-bold group-hover:underline decoration-indigo-600 text-gray-800'>
                      {post.title}
                    </p>
                    <p className='text-sm text-gray-500 break-words'>
                      {post.description}
                    </p>
                  </div>
                  <div
                    className='col-span-4 w-full h-full 
                    rounded-xl transition hover:scale-105 transform duration-300 hover:shadow-xl'>
                    <div className='bg-gray-300 w-full h-full rounded-xl'> </div>
                  </div>
                </div>
                <div className='flex items-center w-full space-x-4 justify-start'>
                  <div className='flex space-x-2 items-center'>
                    {
                      Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className='rounded-2xl bg-gray-200/50 px-5 py-3'>tag {index} </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main >
        <aside className='sticky top-20 col-span-4 h-full w-full p-6 flex flex-col space-y-4'>
          {/* This is for sidebar */}
          <div className='flex flex-col space-y-4 w-full'>
            <h3 className='my-6 font-semibold text-lg'>People you might be intereseted</h3>
            <div className='flex flex-col space-y-4'>
              {Array.from({ length: 4 }).map((_, idx) =>
              (
                <div className='flex w-full items-center space-x-5' key={idx}>
                  <div className='flex-none rounded-full bg-gray-400 h-10 w-10'></div>
                  <div className='flex flex-col w-full'>
                    <p className='font-bold text-sm'>Djamila BAROUDI</p>
                    <p className='text-xs'>Frontend Developer, learner & dreamer</p>
                  </div>
                  <div>
                    <button className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-400
             transition hover:border-gray-900 hover:text-gray-900'>Follow</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className='my-6 font-semibold text-lg'>Your reading list</h3>
            <div className='flex flex-col space-y-8 w-full'>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className='flex items-center space-x-6 group'>
                  <div className='bg-gray-300 w-2/5 aspect-square h-full rounded-2xl'>

                  </div>
                  <div className='flex flex-col justify-start space-y-1 w-3/5'>
                    <div className='text-lg text-gray-900 font-semibold group-hover:underline decoration-indigo:underline'>Lorem ipsum dolor sit.</div>
                    <div className='text-xs text-gray-700'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, molestiae. Eaque sequi exercitationem repudiandae sint quae sunt reiciendis natus odio.</div>
                    <div>
                      <div className='flex w-full space-x-1 items-center'>
                        <div className='rounded-full bg-gray-300 h-8 w-8 flex-none'></div>
                        <div className='flex text-sm font-semibold'>
                          Djamila BAROUDI &#x2022;
                        </div>
                        <div > 17 Feb. 2023</div>
                      </div>
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </div>
        </aside>
      </section >
      <WriteFormModal />
    </MainLayout >
  )
}

export default HomePage