/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { useContext } from 'react'
import { MdMenu } from 'react-icons/md'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineLogout, AiOutlineLogin } from 'react-icons/ai';
import { signIn, signOut, useSession } from 'next-auth/react';

import { GlobalContext } from '../../contexts/GlobalContextProvider';
const Header = () => {
    const { status } = useSession();
    const { setIsWriteModalOpen } = useContext(GlobalContext);
    return (
        <header className='h-20 w-full flex flex-row justify-around items-center bg-white border-b-[1px] border-gray-300'>
            {/* This is for the header */}
            <div> <MdMenu className='text-2xl text-gray-600' /> </div>
            <div className='font-thin text-xl'>Ultimate Blog</div>
            {status === 'authenticated' ? <div className='flex items-center space-x-4'>
                <div> <BsBell className='text-2xl text-gray-600' /> </div>
                <div className='bg-gray-500 w-5 h-5 rounded-full'></div>
                <div>
                    <button onClick={() => setIsWriteModalOpen(true)}
                        className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-200
                                    transition hover:border-gray-900 hover:text-gray-900'>
                        <div>Write</div>
                        <div> <FiEdit /> </div>
                    </button>
                </div>
                <div>
                    <button onClick={() => signOut()} className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-200
                                    transition hover:border-gray-900 hover:text-gray-900'>
                        <div>Logout</div>
                        <div> <AiOutlineLogout /> </div>
                    </button>
                </div>
            </div> :
                <div>
                    <button className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-200
                                    transition hover:border-gray-900 hover:text-gray-900'
                        onClick={() => signIn()}>
                        <div>Login</div>
                        <div> <AiOutlineLogin /> </div>
                    </button>
                </div>}
        </header>
    )
}

export default Header