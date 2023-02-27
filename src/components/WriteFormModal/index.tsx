/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { useContext } from 'react';
import Modal from '../Modal'
import { GlobalContext } from '../../contexts/GlobalContextProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type WriteFormType = {
    title: string;
    description: string;
    body: string;
}
const WriteFormSchema = z.object({
    title: z.string().min(20),
    description: z.string().min(60),
    body: z.string().min(100)
})
const WriteFormModal = ({ }) => {
    const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);
    const { register, handleSubmit, formState: { errors } } = useForm<WriteFormType>({
        resolver: zodResolver(WriteFormSchema)
    });
    const onSubmit = (data: WriteFormType) => console.log(data);
    return (
        <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
            <form action="" onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col items-center justify-center w-full space-y-4'>
                <input
                    className='border rounded-xl border-gray-300 w-full p-4 outline-none focus:border-gray-600'
                    type="text"
                    id="title"
                    placeholder='Title'
                    {...register('title')}
                />
                <p className='text-red-500 w-full text-left text-sm pb-2'> { errors.title?.message}</p>

                <input
                    className='border rounded-xl border-gray-300 w-full p-4 outline-none focus:border-gray-600'
                    type="text"
                    {...register('description')}
                    id="shortDescription"
                    placeholder='Short Description about the blog' />
                <p className='text-red-500 w-full text-left text-sm pb-2'> { errors.description?.message}</p>

                <div className='w-full'>
                    <textarea
                        className='border rounded-xl border-gray-300 focus:border-gray-600 w-full p-4 outline-none'
                        {...register('body')}
                        id="mainBody"
                        cols={30}
                        rows={10}
                        placeholder="blog main body..."
                    >
                    </textarea>
                    <p className='text-red-500 w-full text-left text-sm pb-2'> { errors.body?.message}</p>
                </div>
                <div className='flex justify-end w-full'>
                    <button type='submit'
                        className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-200
                                    transition hover:border-gray-900 hover:text-gray-900'>
                        Publish
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default WriteFormModal