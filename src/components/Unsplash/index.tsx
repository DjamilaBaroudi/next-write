/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState } from 'react'
import Modal from '../Modal'
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../utils/api';
import useDebounce from '../../hooks/useDebounce';
import { z } from 'zod';
import { BiLoaderAlt } from 'react-icons/bi';
import SubmitButton from '../Button';
import { toast } from 'react-hot-toast';

export const unsplashSchema = z.object({
    searchQuery: z.string().min(5)
})

type UnsplashPanelPropertries = {
    unsplashModalOpen: boolean,
    setUnsplashModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    postId: string;
    slug: string;
}

const UsplashImagesPanel = ({ unsplashModalOpen, setUnsplashModalOpen, postId, slug }: UnsplashPanelPropertries) => {

    const [selectedImage, setSelectedImage] = useState('');

    const { register, watch, reset } = useForm<{ searchQuery: string }>({
        resolver: zodResolver(unsplashSchema)
    });

    const WatchedQuery = watch('searchQuery');

    const debouncedSearchQuery = useDebounce(WatchedQuery, 3000);

    const fetchUsplashImages = api.unsplach.getImages.useQuery({
        searchQuery: debouncedSearchQuery
    },
        {
            enabled: Boolean(debouncedSearchQuery)
        })

    const utils = api.useContext();
    const updateFeaturedImage = api.post.updatePostFeturedImage.useMutation({
        onSuccess: () => {
            utils.post.getPost.invalidate({slug});
            setUnsplashModalOpen(false);
            reset();
            toast.success('Featured image succesfully updated')
        }
    });

    return (
        <Modal isOpen={unsplashModalOpen} onClose={() => { setUnsplashModalOpen(false) }}>
            <div className='flex flex-col space-y-4 items-center justify-center'>
                <input
                    type="text"
                    id="searchbar"
                    className='h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-[#628680bd] '
                    {...register('searchQuery')}
                />
                {WatchedQuery && fetchUsplashImages.isLoading &&
                    (<div className='flex w-full h-56 justify-center items-center text-[#e5acb6]'>
                        <BiLoaderAlt className='animate-spin' />
                    </div>)}
                {WatchedQuery && fetchUsplashImages.isSuccess &&
                    <div className='relative h-96 grid grid-cols-3 gap-4 w-full place-items-center overflow-y-scroll'>
                        {fetchUsplashImages.data?.results.map((img) =>
                            <div
                                key={img.id}
                                className='group cursor-pointer aspect-video relative w-full h-full hover:bg-black/40 rounded-md'
                                onClick={() => setSelectedImage(img.urls.full)}
                            >
                                <div className={`absolute ${(selectedImage === img.urls.full) ? "bg-black/40" : ""} group-hover:bg-black/40 inset-0 z-10 h-full w-full`} />
                                <Image src={img.urls.regular} alt={img.alt_description ?? ''} fill />
                            </div>
                        )}
                    </div>}
                {selectedImage &&
                    (<div>
                    <SubmitButton name={updateFeaturedImage.isLoading ? "Loading...": "Confirm"}
                        onClick={() => {
                        updateFeaturedImage.mutate({
                            imageUrl: selectedImage,
                            postId
                        })
                        }}
                        disabled={updateFeaturedImage.isLoading}
                    />
                    </div>)}
            </div>
        </Modal>
    )
}

export default UsplashImagesPanel