import React from 'react'
import Image from 'next/image'

type AvatarProps = {
    alt: string;
    src: string;
}
const Avatar = ({ src, alt }: AvatarProps) => {
    return (
        <div className='relative'>
            <Image src={src} alt={alt} fill className='rounded-full' />
        </div>

    )
}

export default Avatar