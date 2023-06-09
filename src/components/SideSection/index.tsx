import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link";
const SideSection = () => {

    const getBookmarkedPosts = api.post.getBookmarkedPosts.useQuery();
    const getSuggestions = api.post.getSuggestions.useQuery();
    return (
        <aside className='sticky top-20 col-span-4 h-full w-full p-6 flex flex-col space-y-4'>
            {/* This is for sidebar */}
            <div className='flex flex-col space-y-4 w-full'>
                <h3 className='my-6 font-semibold text-lg'>People you might be intereseted</h3>
                <div className='flex flex-col space-y-4'>
                    {getSuggestions.isSuccess && getSuggestions.data.length > 0 &&
                        getSuggestions.data.map((user) =>
                        (
                            <div className='flex w-full items-center space-x-5' key={user.id}>
                                <div className="flex-none rounded-full bg-gray-300 h-8 w-8 relative">
                                    {user.image && <Image
                                        src={user.image}
                                        alt={user.name ?? ''}
                                        fill
                                        className="rounded-full"
                                    />
                                    }
                                </div>
                                <div className='flex flex-col w-full'>
                                    <p className='font-bold text-sm'>{user.name}</p>
                                    <p className='text-xs'>{user.name}</p>
                                </div>
                                <div>
                                    <button className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-400
             transition hover:border-gray-900 hover:text-gray-900'>Follow</button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div>
                <h3 className='my-6 font-semibold text-lg'>Your reading list</h3>
                <div className='flex flex-col space-y-8 w-full'>
                    {getBookmarkedPosts.isSuccess && getBookmarkedPosts.data?.map((bookmark) => (
                        <Link
                            href={bookmark.post.slug}
                            key={bookmark.id}
                            className='flex items-center space-x-6 group'>

                            <div className='bg-gray-300 w-2/5 aspect-square h-full rounded-2xl'>
                            </div>
                            <div className='flex flex-col justify-start space-y-1 w-3/5'>
                                <div className='text-lg text-gray-900 font-semibold group-hover:underline decoration-indigo:underline'>{bookmark.post.title}</div>
                                <div className='text-xs text-gray-700 truncate'>{bookmark.post.description}</div>
                                <div>
                                    <div className='flex w-full space-x-1 items-center'>
                                        <div className='rounded-full bg-gray-300 h-8 w-8 relative'>
                                            {bookmark.post.author.image && <Image
                                                src={bookmark.post.author.image}
                                                alt={bookmark.post.author.name ?? ''}
                                                fill
                                                className="rounded-full"
                                            />}

                                        </div>
                                        <div className='flex text-sm font-semibold'>
                                            {bookmark.post.author.name} &#x2022;
                                        </div>
                                        <div > {bookmark.post.created_at.toDateString()}</div>
                                    </div>
                                </div>
                            </div>

                        </Link>
                    ))}

                </div>
            </div>
        </aside>
    )
}

export default SideSection