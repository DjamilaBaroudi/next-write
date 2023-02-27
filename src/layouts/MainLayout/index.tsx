/* eslint-disable @typescript-eslint/no-misused-promises */
import type { PropsWithChildren} from 'react';
import React from 'react'
import Header from '../../components/Header';

function MainLayout({ children }: PropsWithChildren) {


    return (
        <div className="flex flex-col w-full h-full">
           <Header/>
            {children}
        </div>
    )
}

export default MainLayout