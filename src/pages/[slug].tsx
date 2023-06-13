import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { BsChat } from 'react-icons/bs';
import MainLayout from '../layouts/MainLayout';
import { api } from '../utils/api';
import CommentSideBar from '../components/CommentsSideBar';
import WriteFormModal from '../components/WriteFormModal';
import toast from 'react-hot-toast';
import { RiComputerLine, RiImageEditLine, RiUnsplashFill } from 'react-icons/ri';
import Modal from '../components/Modal';
import UsplashImagesPanel from '../components/Unsplash';
import { useSession } from 'next-auth/react';
import Image from 'next/image';


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

    const { data } = useSession()

    const invalidateCurrentPost = useCallback(() => {
        return postRoute.getPost.invalidate({ slug: router.query.slug as string });
    }, [postRoute.getPost, router.query.slug])


    const likePost = api.post.likePost.useMutation({
        onSuccess: async () => {
            await invalidateCurrentPost()
        },
        onError: (error) => { toast.error(error.message) }
    });

    const dislikePost = api.post.dislikePost.useMutation({
        onSuccess: async () => {
            await invalidateCurrentPost()
        },
        onError: (error) => { toast.error(error.message) }
    });

    const [showCommentsSideBar, setShowCommentsSideBar] = useState(false);
    const [selectImageModalOpen, setSelectImageModalOpen] = useState(false);
    const [unsplashModalOpen, setUnsplashModalOpen] = useState(false);



    return <MainLayout>

        {getPost.isSuccess && getPost.data && <UsplashImagesPanel
            unsplashModalOpen={unsplashModalOpen}
            setUnsplashModalOpen={setUnsplashModalOpen}
            postId={getPost.data?.id}
            slug={getPost.data.slug}
        ></UsplashImagesPanel>}

        <Modal isOpen={selectImageModalOpen} onClose={() => setSelectImageModalOpen(false)}
            className='max-w-screen-md'
        >
            <div className='w-full ml-auto mr-auto max-w-md flex flex-col justify-center p-4 items-center'>
                <div className='w-full'>
                    <button className='w-full p-5 flex items-center justify-center my-2 bg-slate-200 border rounded-lg hover:bg-slate-300 transition duration-300'>
                        <span> Computer </span>
                        <span className='ml-4 text-lg'> <RiComputerLine /> </span>
                    </button>
                </div>
                <div className='w-full'>
                    <button onClick={() => {
                        setUnsplashModalOpen(true),
                            setSelectImageModalOpen(false)
                    }}
                        className='w-full p-5 flex items-center justify-center bg-slate-200 rounded-lg hover:bg-slate-300 transition duration-300'>
                        <span> Unsplash </span>
                        <span className='ml-4 text-xl'> <RiUnsplashFill /> </span>
                    </button>
                </div>
            </div>
        </Modal>

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
                    {getPost.isSuccess && getPost.data?.featuredImage &&
                        <Image
                            src={getPost.data?.featuredImage}
                            alt={getPost.data?.title}
                            fill
                            className="rounded-xl"
                        />
                    }
                    {data?.user.id === getPost.data?.authorId && (<div onClick={() => setSelectImageModalOpen(true)}
                        className='absolute top-2 z-10 left-2 text-3xl text-gray-700 bg-slate-200 cursor-pointer rounded-md p-2 transition duration-200 hover:bg-slate-500 hover:text-white'>
                        <RiImageEditLine />
                    </div>)}
                    <div className='absolute flex justify-center items-center w-full h-full'>
                        <div className='text-3xl text-center font-bold rounded-xl bg-neutral-800 bg-opacity-40 p-4 text-white'>
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

