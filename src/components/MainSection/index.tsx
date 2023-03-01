import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import { api } from '../../utils/api'
import Post from '../Post'

const MainSection = () => {
    const getPosts = api.post.getPosts.useQuery();

    return (
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
                    <Post key={post.id} {...post}  />
                ))}
            </div>

        </main >
    )
}

export default MainSection