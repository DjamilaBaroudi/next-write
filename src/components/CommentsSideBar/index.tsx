/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { AiOutlineClose } from 'react-icons/ai'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../../utils/api'
import { toast } from 'react-hot-toast'
import moment from 'moment'
import Image from 'next/image'

type CommentSideBarProps = {
    showCommentsSideBar: boolean;
    setShowCommentsSideBar: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string;
}

export const CommentFormSchema = z.object({
    text: z.string().min(5),
})

type CommentFormType = {
    text: string;
    postId: string;
}
const CommentSideBar = ({
    showCommentsSideBar: showCommentsSideBar,
    setShowCommentsSideBar: setShowCommentsSideBar,
    postId
}: CommentSideBarProps) => {

    const { register, handleSubmit, reset, formState: { isValid } } = useForm<CommentFormType>(
        { resolver: zodResolver(CommentFormSchema) }
    )

    const submitComment = api.post.createComment.useMutation({
        onSuccess: () => {
            toast.success('🥳')
            reset();
        },
        onError: (error) => { toast.error(error.message) }
    })

    const onSubmit = (data: CommentFormType) => {
        submitComment.mutate({ ...data, postId });
    };

    const getComments = api.post.getComments.useQuery({ postId });
    return (
        <Transition.Root show={showCommentsSideBar} as={Fragment}>
            <Dialog as={'div'} onClose={() => setShowCommentsSideBar(false)}>
                <div className='fixed right-0 top-0'>
                    <Transition.Child
                        enter='transition duration-1000'
                        leave='transition duration-500'
                        enterFrom='translate-x-full'
                        enterTo='translate-x-0'
                        leaveFrom='translate-x-0'
                        leaveTo='translate-x-full'
                    >
                        <Dialog.Panel className='relative w-[200px] sm:w-[480px] h-screen bg-white shadow-lg overflow-scroll'>
                            <div className='flex flex-col w-full px-6'>
                                <div className='flex justify-between items-center mt-10 mb-5 w-full text-xl'>
                                    <h2 className='font-medium'>Responses ({getComments.data?.length})</h2>
                                    <div >
                                        <AiOutlineClose className='cursor-pointer' onClick={() => setShowCommentsSideBar(false)} />
                                    </div>
                                </div>
                                <form
                                    className='flex w-full flex-col space-y-4 items-end p-5'
                                    onSubmit={handleSubmit(onSubmit)}>
                                    <textarea
                                        id="comment"
                                        rows={3}
                                        className='w-full p-4 border rounded-xl border-gray-300 outline-none focus:border-gray-600'
                                        placeholder='What are your toughts?'
                                        {...register('text')}>
                                    </textarea>
                                    <div className='flex justify-end w-full'>
                                        {isValid &&
                                            <button type='submit'
                                                className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-300
                            transition hover:border-gray-900 hover:text-gray-900'>
                                                Comment
                                            </button>}
                                    </div>
                                </form>
                                <div className='flex flex-col items-center justify-center space-y-6'>
                                    {getComments.isSuccess && getComments.data?.map((comment) =>
                                        <div className='h-full w-full flex flex-col space-y-2 border-b border-b-gray-200 last:border-none pb-4' key={comment.id}>
                                            <div className='flex w-full space-x-2 items-center'>
                                                <div className='rounded-full relative bg-gray-400 h-8 w-8'>
                                                    {comment.user.image &&
                                                        <Image
                                                            src={comment.user.image}
                                                            alt={comment.user.name ?? ''}
                                                            fill
                                                            className='rounded-full'
                                                        />}
                                                </div>
                                                <div className='flex flex-col w-full'>
                                                    <p className='font-semibold'>{comment.user.name}</p>
                                                    <p className='text-sm text-gray-400'>
                                                        <span className='mx-1'>
                                                            {moment(comment.created_at).fromNow()}
                                                        </span></p>
                                                </div>
                                            </div>
                                            <div className='text-sm text-gray-600 m-2'>
                                                {comment.text}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default CommentSideBar