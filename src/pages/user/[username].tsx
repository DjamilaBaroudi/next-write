/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { api } from '../../utils/api'
import { BiEdit } from 'react-icons/bi'
import { RiShareForward2Fill } from 'react-icons/ri'
import { toast } from 'react-hot-toast'
import Post from '../../components/Post'
import { useSession } from 'next-auth/react'


const UserProfilePage = () => {
    const router = useRouter();
    const currentUser = useSession();

    const userProfile = api.user.getUserProfile.useQuery({
        username: router.query.username as string
    }, {
        enabled: !!router.query.username
    })
    const getUserPosts = api.user.getCurrentUserPosts.useQuery({
        username: router.query.username as string
    }, {
        enabled: !!router.query.username
    })


    const [objectImage, setobjectImage] = useState('');

    const userRoute = api.useContext().user

    const uploadAvatar = api.user.uploadAvatar.useMutation({
        onSuccess: () => {
            if (userProfile.data?.username) {
                userRoute.getUserProfile.invalidate({
                    username: router.query.username as string
                });
                toast.success('Avatar successfully updated 🎉')
            }
        }
    });

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 1 * 1000000) {
                return toast.error("Image size shoudn\'t be greater than 1MB")
            }

            setobjectImage(URL.createObjectURL(file));

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);

            fileReader.onloadend = () => {
                if (fileReader.result && userProfile.data?.username) {
                    uploadAvatar.mutate({
                        imageAsDataUrl: fileReader.result as string,
                        username: userProfile.data?.username
                    })
                }
            }
        }
    }
    return (
        <MainLayout>
            <div className='w-full h-full flex justify-center items-center '>
                <div className='flex flex-col justify-center items-center  w-full xl:max-w-screen-lg lg:max-w-screen-md my-10 p-10'>
                    <div className='bg-white rounded-3xl flex flex-col w-full shadow-md'>
                        <div className='relative h-44 w-full rounded-t-3xl bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-100'>
                            <div className='absolute -bottom-10 left-12'>
                                <div className='relative w-28 h-28 rounded-full bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-50 border group border-3 border-purple-200 shadow-xl'>
                                    {userProfile.data?.id === currentUser.data?.user.id &&
                                        <label htmlFor='avatarFile' className='absolute cursor-pointer flex justify-center items-center group-hover:bg-black/10 z-10 rounded-full w-full h-full transition duration-500'>
                                            <BiEdit className='text-3xl text-white hidden group-hover:block' />
                                            <input
                                                type="file"
                                                name='avatarFile'
                                                id='avatarFile'
                                                className='sr-only'
                                                accept='image/*'
                                                onChange={handleChangeImage}
                                                multiple={false}
                                            />
                                        </label>
                                    }
                                    {!objectImage && userProfile.data?.image &&
                                        <Image
                                            fill
                                            src={userProfile.data?.image}
                                            alt={userProfile.data?.name ?? ''} className='rounded-full'>
                                        </Image>}
                                    {objectImage &&
                                        <Image
                                            fill
                                            src={objectImage}
                                            alt={userProfile.data?.name ?? ''} className='rounded-full'>
                                        </Image>}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full rounded-b-3xl ml-12 py-6 space-y-1'>
                            <div className='text-2xl mt-6 font-semibold text-gray-800'>
                                {userProfile?.data?.name}
                            </div>
                            <div className='text-gray-500'>
                                @{userProfile?.data?.username}
                            </div>
                            <div className='text-gray-500'>
                                {userProfile?.data?._count.posts ?? 0} Posts
                            </div>
                            <div>
                                <button onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Url Copied to clipboard! 🥳')
                                }}
                                    className='flex rounded items-center mt-2 px-4 py-2 space-x-3 border border-gray-200
                                    transition hover:border-gray-900 hover:text-gray-900 active:scale-95'>
                                    <div>Share</div>
                                    <div className='text-xl text-purple-400'> <RiShareForward2Fill /> </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='w-full my-14'>
                        {getUserPosts.isSuccess && getUserPosts.data?.posts.map((post) =>
                            <Post key={post.id} {...post} />
                        )
                        }
                    </div>
                </div>

            </div>
        </MainLayout>
    )
}

export default UserProfilePage