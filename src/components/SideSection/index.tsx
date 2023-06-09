import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button";
import toast from "react-hot-toast";
const SideSection = () => {

    const getBookmarkedPosts = api.post.getBookmarkedPosts.useQuery();
    const getSuggestions = api.user.getSuggestions.useQuery();

    const followUsers = api.user.followUser.useMutation({
        onSuccess() {
            toast.success("Followed user")
        },
    })
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
                                    <p className='text-xs'>{user.username}</p>
                                </div>
                                <div>
                                    <Button name={"Follow"} onClick={() => followUsers.mutate({
                                        followingUserID: user.id
                                    }) }></Button>
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
                            href={`/${bookmark.post.slug}`}
                            key={bookmark.id}
                            className='flex items-center space-x-6'>
                            <div className='flex flex-col justify-start space-y-1 w-full pl-2 pr-4'>
                                <div className='text-lg text-gray-900 font-semibold hover:underline decoration-indigo:underline'>{bookmark.post.title}</div>
                                <div className='text-xs text-gray-700 truncate'>{bookmark.post.description}</div>
                                <div>
                                    <Link href={`/user/${bookmark.post.author.username}`} className='flex w-full space-x-1 items-center'>
                                        <div className='rounded-full bg-gray-300 h-8 w-8 relative'>
                                            {bookmark.post.author.image && <Image
                                                src={bookmark.post.author.image}
                                                alt={bookmark.post.author.name ?? ''}
                                                fill
                                                className="rounded-full"
                                            />}

                                        </div>
                                        <div className='hover:underline decoration-indigo:underline flex text-sm font-semibold'>
                                            {bookmark.post.author.name} 
                                        </div>
                                        <div > &#x2022; {bookmark.post.created_at.toDateString()}</div>
                                    </Link>
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