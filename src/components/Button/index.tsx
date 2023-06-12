import type { ReactNode } from 'react';
import React from 'react'

type ButtonProperties = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    name: string;
    disabled?: boolean;
    children?: ReactNode;
}
const SubmitButton = ({ name, onClick, disabled, children }: ButtonProperties) => {
    return (
        <div>
            <button type='submit'
                disabled={disabled}
                onClick={onClick}
                className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-200
            transition hover:border-gray-900 hover:text-gray-900 active:bg-slate-500 active:text-white'>
                {name}
            </button>
            {children}
        </div>

    )
}

export default SubmitButton