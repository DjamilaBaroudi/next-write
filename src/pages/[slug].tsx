/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useRouter } from 'next/router'
import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import MainLayout from '../layouts/MainLayout';
import { api } from '../utils/api';

const PostPage = () => {
    const router = useRouter();

    const getPost = api.post.getPost.useQuery({
        slug: router.query.slug as string
    },
        {
            enabled: !!router.query.slug // fetch the post only whne it's availble, !! converts the string to boolean
        }
    )
    return <MainLayout>
        {getPost.isLoading && <div className='w-full h-full flex items-center justify-center space-x-4'>
            <div>
                <AiOutlineLoading3Quarters size={'1rem'} color={'#5F2AF0'} className='animate-spin' />
            </div>
            <div>
                Loading...
            </div>
        </div>}
        <div className='w-full h-full flex flex-col items-center justify-center p-10'>
            <div className='w-full max-w-screen-lg flex flex-col space-y-4'>
                <div className='h-[60vh] rounded-xl bg-gray-300 w-full shadow-lg relative flex justify-center items-center'>
                    <div className='absolute flex justify-center items-center w-full h-full'>
                        <div className='text-3xl font-bold rounded-xl bg-neutral-800 bg-opacity-40 p-4 text-white'>
                            {getPost.data?.title}
                        </div></div>
                </div>
                <div className='border-l-4 border-gray-800 pl-6'>
                    {getPost.data?.description}
                </div>
                <div>
                    {getPost.data?.text}
                </div>
            </div>
        </div>
    </MainLayout>
}

export default PostPage