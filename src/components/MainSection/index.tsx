import React, { useCallback } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import Image from 'next/image'
import { api } from '../../utils/api'
import Link from 'next/link'
import { BsBookmarkCheck, BsBookmarkPlus } from 'react-icons/bs'

const MainSection = () => {
    const getPosts = api.post.getPosts.useQuery();

    const postRoute = api.useContext().post;

    const invalidateAllPosts = useCallback(() => {
        return postRoute.getPosts.invalidate()
    }, [postRoute.getPosts]);

    const bookmarkPost = api.post.bookmarkPost.useMutation({
        onSuccess: async () => {
            await invalidateAllPosts();
        }
    });
    const removeBookmarkPost = api.post.removeBookmarkPost.useMutation({
        onSuccess: async () => {
            await invalidateAllPosts();
        }
    });
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
                    < div
                        key={post.id}
                        className='flex flex-col group space-y-8 pb-8 border-b border-gray-300 last:border-none'>
                        <Link href={`/${post.slug}`}>
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
                        </Link>
                        <div className='flex items-center w-full space-x-4 justify-between'>
                            <div className='flex space-x-2 items-center'>
                                {
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <div key={index} className='rounded-2xl bg-gray-200/50 px-5 py-3'>tag {index} </div>
                                    ))
                                }
                            </div>
                            <div>
                                {post.bookmarks && post.bookmarks.length > 0 ?
                                    <BsBookmarkCheck className='text-2xl text-gray-800 cursor-pointer' onClick={() => removeBookmarkPost.mutate({
                                        postId: post.id
                                    })} />

                                    : <BsBookmarkPlus className='text-2xl text-gray-800 cursor-pointer' onClick={() => bookmarkPost.mutate({
                                        postId: post.id
                                    })} />
                                }
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </main >
    )
}

export default MainSection