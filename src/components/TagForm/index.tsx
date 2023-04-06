
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { api } from '../../utils/api';
import Modal from '../Modal'

type TagFormType = {
    name: string;
    description: string;
}
export const TagFormSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10)
})

type TagActionsType = {
    isOpen: boolean;
    onClose: () => void;
}
const TagForm = ({ isOpen, onClose }: TagActionsType) => {

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<TagFormType>({
        resolver: zodResolver(TagFormSchema)
    });

    //import the create tag 
    const createTag = api.tag.createTag.useMutation({
        onSuccess: () => {
            toast.success('tag successfuly created!');
            onClose();
            reset();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
        }

    })

    const onTagSubmit = (data: TagFormType) => {
        createTag.mutate(data);
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New tag">
            <form action="submit" onSubmit={handleSubmit(onTagSubmit)}>
                <input
                    type="text"
                    id="newTag"
                    placeholder='New tag'
                    {...register('name')}
                    className='border rounded-xl border-gray-300 w-full p-4 outline-none focus:border-gray-600'
                />
                <p className='text-red-500 w-full text-left text-sm pb-2'> {errors.name?.message}</p>
                <input
                    className='border rounded-xl border-gray-300 w-full p-4 outline-none focus:border-gray-600'
                    type="text"
                    {...register('description')}
                    id="shortTagDescription"
                    placeholder='Short description for the tag' />
                <p className='text-red-500 w-full text-left text-sm pb-2'> {errors.description?.message}</p>
                
                <div className='flex justify-end w-full'>
                    <button type='submit'
                        className='whitespace-nowrap rounded px-4 py-2 space-x-3 border border-gray-200
                                    transition hover:border-gray-900 hover:text-gray-900'>
                        Create tag
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default TagForm


