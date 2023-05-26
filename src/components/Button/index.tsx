import React from 'react'

const SubmitButton = ({ name }: { name: string }) => {
    return (
        <button type='submit'
            className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-200
                transition hover:border-gray-900 hover:text-gray-900'>
            {name}
        </button>
    )
}

export default SubmitButton