import React, { useState } from 'react'
import { useContext } from 'react';
import Modal from '../Modal'
import { GlobalContext } from '../../contexts/GlobalContextProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import TagsAutocompletion from '../TagsAutocompletion';
import TagForm from '../TagForm';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import SubmitButton from '../Button';

export type Tag = {
    id: string; name: string,
}
type WriteFormType = {
    title: string;
    description: string;
    text: string;
}
export const WriteFormSchema = z.object({
    title: z.string().min(20),
    description: z.string().min(60),
    text: z.string().min(100)
})


const WriteFormModal = ({ }) => {
    const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors } } = useForm<WriteFormType>({
            resolver: zodResolver(WriteFormSchema)
        });


    const postRoute = api.useContext().post;

    const createPost = api.post.createPost.useMutation({
        onSuccess: () => {
            toast.success('post successfuly created!');
            setIsWriteModalOpen(false);
            reset();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            postRoute.getPosts.invalidate();

        }
    })

    const onSubmit = (data: WriteFormType) => {
        const mutationData = selectedTags.length !== 0 ? { ...data, tagsIds: selectedTags } : data
        createPost.mutate(mutationData);
    };

    const getTags = api.tag.getAllTags.useQuery();

    return (

        <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
            {getTags.isSuccess &&
                <>
                    <TagForm
                        isOpen={isTagModalOpen}
                        onClose={() => setIsTagModalOpen(false)}
                    />

                    <div className='my-4 flex w-full items-center justify-center space-x-4'>
                        <div className='z-10 w-4/5'>
                            <TagsAutocompletion
                                tags={getTags.data}
                                setselectedTags={setSelectedTags}
                                selectedTags={selectedTags}
                            />
                        </div>
                        <button type='submit'
                            onClick={() => setIsTagModalOpen(true)}
                            className='whitespace-nowrap rounded px-4 py-2 space-x-3 border border-gray-200
                                    transition hover:border-gray-900 hover:text-gray-900'>
                            New tag
                        </button>
                    </div>
                    <div className='flex flex-wrap w-full mb-3 items-center' >
                        {selectedTags.map((selectedTag) =>
                            <div className=' flex items-center px-4 py-2 m-2 rounded-3xl border whitespace-nowrap justify-center space-x-3  transition duration-200 hover:border-[#e5acb6]' key={selectedTag.id}>
                                <div>{selectedTag.name}</div>
                                <div className='flex-none'
                                    onClick={() => { setSelectedTags(((prev) => prev.filter((currTag) => currTag !== selectedTag))) }}>
                                    <AiOutlineCloseCircle
                                        className='text-lg text-[#e5acb6] cursor-pointer ' />
                                </div>
                            </div>
                        )
                        }
                    </div>
                </>}

            <form onSubmit={handleSubmit(onSubmit)}
                className='flex relative flex-col items-center justify-center w-full space-y-4'>

                {createPost.isLoading && <div className='absolute w-full h-full flex items-center justify-center'>
                    <AiOutlineLoading3Quarters className='animate-spin' />
                </div>}

                <input
                    className='border rounded-xl border-gray-300 w-full p-4 outline-none focus:border-gray-600'
                    type="text"
                    id="title"
                    placeholder='Title'
                    {...register('title')}
                />
                <p className='text-red-500 w-full text-left text-sm pb-2'> {errors.title?.message}</p>

                <input
                    className='border rounded-xl border-gray-300 w-full p-4 outline-none focus:border-gray-600'
                    type="text"
                    {...register('description')}
                    id="shortDescription"
                    placeholder='Short Description about the blog' />
                <p className='text-red-500 w-full text-left text-sm pb-2'> {errors.description?.message}</p>

                <div className='w-full'>
                    <textarea
                        className='border rounded-xl border-gray-300 focus:border-gray-600 w-full p-4 outline-none'
                        {...register('text')}
                        id="mainBody"
                        cols={30}
                        rows={10}
                        placeholder="blog main body..."
                    >
                    </textarea>
                    <p className='text-red-500 w-full text-left text-sm pb-2'> {errors.text?.message}</p>
                </div>
                <div className='flex justify-end w-full'>
                    <SubmitButton name="publish" />
                </div>
            </form>
        </Modal>

    )
}

export default WriteFormModal