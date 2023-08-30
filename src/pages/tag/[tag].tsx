import { useRouter } from 'next/router';
import React from 'react'
import Post from '../../components/Post';
import type { RouterOutputs } from '../../utils/api';
import { api } from '../../utils/api';
import MainLayout from '../../layouts/MainLayout';


type tagProps = RouterOutputs['tag']['getAllTags'][number];

const TagsPosts = ({ ...tag }: tagProps) => {
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const getPostsForSpecificTag = api.post.getTagedPosts.useQuery({ tagID: router.query.tag as string })
    if (getPostsForSpecificTag.isFetching) return <div>Loading...</div>
    if (getPostsForSpecificTag.isError) return <div>Error</div>
    if (getPostsForSpecificTag.isSuccess && getPostsForSpecificTag.data)

        return (
            <MainLayout>
                <div className='container flex flex-col justify-center items-center w-[60%] m-auto'>
                    {
                        getPostsForSpecificTag.isSuccess && getPostsForSpecificTag.data.map((post) =>
                            <Post key={tag.id} {...post} bookmarks={[]} />
                        )
                    }
                </div>
            </MainLayout>
        )
}

export default TagsPosts