import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import { api } from '../../utils/api'
import Post from '../Post'
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link'

const MainSection = () => {
    const getPosts = api.post.getPosts.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });
    const getTags = api.tag.getAllTags.useQuery();
    const mostUsedTags = getTags.data?.sort((tagA, tagB) => (
        (tagB._count.posts) - (tagA._count.posts)
    )).slice(0, 4)
 

    return (
        <main className='md:col-span-8 col-span-12 items-center md:border-r border-gray-300 h-full w-full md:px-24 '>
            <div className='flex flex-col space-y-4 w-full py-10'>
                <div className='flex flex-col space-x-4 items-center md:w-full lg:flex-row'>
                    <label htmlFor="search" className='relative w-full border-gray-800 border rounded-3xl'>
                        <div className='absolute left-2 h-full flex items-center'>
                            <CiSearch />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className='outline-none py-1 px-4 pl-7 ml-2 my-0.5 text-md placeholder:text-xs placeholder:text-gray-300'
                            placeholder='Search...' />
                    </label>
                    <div className='inline-flex items-center w-full space-x-4 justify-end text-xs font-bold leading-sm uppercase px-3 py-1 rounded-full'>
                        <div>topics: </div>
                        
                            <div className='flex flex-wrap justify-center space-x-2 items-center lg:flex-nowrap'>
                            {
                                mostUsedTags && mostUsedTags.map((tag, index) => (
                                    <Link href={`/tag/${tag.id}`} key={index} className='rounded-3xl cursor-pointer bg-gray-200/50 my-1 max-w-xs px-4 py-6 flex justify-center items-center h-8 md:w-full'>
                                    <span className='text-xs'>{tag.name}</span>
                                    </Link>
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
                <InfiniteScroll
                    dataLength={getPosts.data?.pages.flatMap((page)=>page.posts).length ?? 0} //This is important field to render the next data
                    next={getPosts.fetchNextPage}
                    hasMore={Boolean(getPosts.hasNextPage)}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    
                >
                    {getPosts.isSuccess && getPosts.data?.pages.flatMap((page)=>page.posts).map((post) => (
                        <Post key={post.id} {...post} />
                    ))}
                </InfiniteScroll>

            </div>

        </main >
    )
}

export default MainSection