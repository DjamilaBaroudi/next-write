import { useRouter } from 'next/router';
import React from 'react'
import Post from '../../components/Post';
import { api, RouterOutputs } from '../../utils/api';


type tagProps = RouterOutputs['tag']['getAllTags'][number];

const TagsPosts = ({ ...tag }: tagProps) => {
    const router = useRouter();
    const tagRoute = api.useContext().tag;

    //const getPostsForSpecificTag = api.post.getTagedPosts.useQuery({tagID: tag.id})

    return (
        <div>
           {/*  {
                getPostsForSpecificTag.data && getPostsForSpecificTag.data.map((post) =>
                <Post key={tag.id} {...post}/>
                )
            } */}
        </div>
    )
}

export default TagsPosts