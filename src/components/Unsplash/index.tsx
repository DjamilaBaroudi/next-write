import React from 'react'
import Modal from '../Modal'
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../utils/api';
import useDebounce from '../../hooks/useDebounce';
import { z } from 'zod';
import { BiLoaderAlt } from 'react-icons/bi';

export const unsplashSchema = z.object({
    searchQuery: z.string().min(5)
})

type UnsplashPanelPropertries = {
    unsplashModalOpen: boolean,
    setUnsplashModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UsplashImagesPanel = ({ unsplashModalOpen, setUnsplashModalOpen }: UnsplashPanelPropertries) => {


    const { register, watch } = useForm<{ searchQuery: string }>({
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
    console.log("this is from unsplash component", fetchUsplashImages.data?.results)
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
                        <div key={img.id} className='aspect-video relative w-full h-full'>
                            <Image src={img.urls.thumb} alt={img.alt_description ?? ''} fill />
                        </div>
                    )}
                </div>}
            </div>
        </Modal>
    )
}

export default UsplashImagesPanel