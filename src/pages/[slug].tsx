import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { BsChat } from 'react-icons/bs';
import MainLayout from '../layouts/MainLayout';
import { api } from '../utils/api';
import CommentSideBar from '../components/CommentsSideBar';
import WriteFormModal from '../components/WriteFormModal';

const PostPage = () => {
    const router = useRouter();
    const getPost = api.post.getPost.useQuery({
        slug: router.query.slug as string
    },
        {
            enabled: !!router.query.slug // fetch the post only whne it's availble, !! converts the string to boolean
        }
    )
    const postRoute = api.useContext().post;

    const invalidateCurrentPost = useCallback(() => {
        return postRoute.getPost.invalidate({ slug: router.query.slug as string });
    }, [postRoute.getPost, router.query.slug])


    const likePost = api.post.likePost.useMutation({
        onSuccess: async () => {
            await invalidateCurrentPost()
        }
    });

    const dislikePost = api.post.dislikePost.useMutation({
        onSuccess: async () => {
            await invalidateCurrentPost()
        }
    });
    const [showCommentsSideBar, setShowCommentsSideBar] = useState(false);

    return <MainLayout>
        {getPost.data?.id &&
            <CommentSideBar
                showCommentsSideBar={showCommentsSideBar}
                setShowCommentsSideBar={setShowCommentsSideBar}
                postId={getPost.data?.id}
            ></CommentSideBar>
        }
        {getPost.isLoading && <div className='w-full h-full flex items-center justify-center space-x-4'>
            <div>
                <AiOutlineLoading3Quarters size={'1rem'} color={'#5F2AF0'} className='animate-spin' />
            </div>
            <div>
                Loading...
            </div>
        </div>}
        {
            getPost.isSuccess && <div className='fixed bottom-10 w-full flex justify-center items-center'>
                <div className='flex bg-white rounded-full border border-gray-350 items-center justify-center space-x-4 px-7 py-4 hover:border-[#3b3f43] group transition duration-300 shadow-xl'>
                    <div className='transition duration-300 border-r border-gray-300 pr-4 group-hover:border-[#3b3f43]'>
                        {getPost.data?.likes && getPost.data?.likes.length > 0 ? <FcLike className='text-xl cursor-pointer' onClick={() => getPost.data?.id && dislikePost.mutate({
                            postId: getPost.data?.id
                        })} />
                            : <FcLikePlaceholder className='text-xl cursor-pointer' onClick={() => getPost.data?.id && likePost.mutate({
                                postId: getPost.data?.id
                            })} />}</div>
                    <div >
                        <BsChat className='text-lg cursor-pointer' onClick={() => setShowCommentsSideBar(true)} />
                    </div>
                </div>
            </div>
        }
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
        <WriteFormModal />
    </MainLayout>
}

export default PostPage

