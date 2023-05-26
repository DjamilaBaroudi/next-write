/* eslint-disable @typescript-eslint/no-floating-promises */
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { BsBookmarkCheck, BsBookmarkPlus } from 'react-icons/bs'
import type { RouterOutputs } from '../../utils/api';
import { api } from '../../utils/api'
import { useState } from 'react'

type PostProps = RouterOutputs['post']['getPosts'][number];

const Post = ({ ...post }: PostProps) => {

    const [isBookmarked, setIsBookmarked] = useState(Boolean(post.bookmarks?.length));

    const postRoute = api.useContext().post;

    const bookmarkPost = api.post.bookmarkPost.useMutation({
        onSuccess: () => {
            setIsBookmarked((prev) => !prev)
            postRoute.getBookmarkedPosts.invalidate();
        }
    });
    const removeBookmarkPost = api.post.removeBookmarkPost.useMutation({
        onSuccess: () => {
            setIsBookmarked((prev) => !prev)
            postRoute.getBookmarkedPosts.invalidate();
        }
    });
    const getTagsForPost = api.tag.getTagsForPost.useQuery({
        postId: post.id,
    })
    return (
        < div key={post.id}
            className='flex flex-col space-y-8 pb-8 border-b border-gray-300 last:border-none'>

            <Link href={`/user/${post.author.username}`} className='group flex w-full space-x-2 items-center cursor-pointer'>
                <div className='rounded-full relative bg-gray-400 h-10 w-10'>
                    {post.author.image &&
                        <Image
                            src={post.author.image}
                            alt={post.author.name ?? ''}
                            fill
                            className='rounded-full'
                        />}
                </div>
                <div className='flex flex-col w-full'>
                    <p className='font-semibold'>
                        <span className='group-hover:underline decoration-indigo-600'>{post.author.name}</span>{" "} &#x2022;
                        <span className='mx-1'>
                            {post.created_at.toDateString()}
                        </span>
                    </p>
                    <p className='text-sm'>Frontend Developer, learner & dreamer</p>
                </div>
            </Link>
            <Link href={`/${post.slug}`}>
                <div className='group grid grid-cols-12 w-full min-h-[6rem] gap-4'>
                    <div className='col-span-8 flex flex-col space-y-4'>
                        <p className='text-2xl font-bold group-hover:underline decoration-indigo-600 text-gray-800'>
                            {post.title}
                        </p>
                        <p className='text-sm text-gray-500 break-words text-ellipsis'>
                            {post.description}
                        </p>
                    </div>
                    <div className='col-span-4 w-full h-full rounded-xl transition hover:scale-105 transform duration-300 hover:shadow-xl'>
                        {post.featuredImage ? <Image src={post.featuredImage} alt={post.title} className='rounded-xl'
                            fill
                        />
                            : <div className='bg-gray-300 w-full h-full rounded-xl'> </div>}
                    </div>
                </div>
            </Link>
            <div className='flex items-center w-full space-x-4 justify-between'>
                <div className='flex space-x-2 items-center'>
                    {
                        getTagsForPost.isSuccess && getTagsForPost.data?.tags.map((tag) => (
                            <Link href={`/tag/${tag.id}`} key={tag.id}
                                onClick={() => console.log('clicked')}
                                className='rounded-2xl bg-gray-200/50 px-5 py-1.5 cursor-pointer'
                            >
                                {tag.name}
                            </Link>
                        ))
                    }
                </div>
                <div>
                    {isBookmarked ?
                        <BsBookmarkCheck className='text-2xl text-indigo-600 cursor-pointer' onClick={() => removeBookmarkPost.mutate({
                            postId: post.id
                        })} />

                        : <BsBookmarkPlus className='text-2xl text-gray-800 cursor-pointer' onClick={() => bookmarkPost.mutate({
                            postId: post.id
                        })} />
                    }
                </div>
            </div>

        </div>
    )
}

export default Post