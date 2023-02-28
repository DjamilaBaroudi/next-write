import React from "react";

const SideSection = () => {
    return (
        <aside className='sticky top-20 col-span-4 h-full w-full p-6 flex flex-col space-y-4'>
            {/* This is for sidebar */}
            <div className='flex flex-col space-y-4 w-full'>
                <h3 className='my-6 font-semibold text-lg'>People you might be intereseted</h3>
                <div className='flex flex-col space-y-4'>
                    {Array.from({ length: 4 }).map((_, idx) =>
                    (
                        <div className='flex w-full items-center space-x-5' key={idx}>
                            <div className='flex-none rounded-full bg-gray-400 h-10 w-10'></div>
                            <div className='flex flex-col w-full'>
                                <p className='font-bold text-sm'>Djamila BAROUDI</p>
                                <p className='text-xs'>Frontend Developer, learner & dreamer</p>
                            </div>
                            <div>
                                <button className='flex rounded items-center px-4 py-2 space-x-3 border border-gray-400
             transition hover:border-gray-900 hover:text-gray-900'>Follow</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className='my-6 font-semibold text-lg'>Your reading list</h3>
                <div className='flex flex-col space-y-8 w-full'>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className='flex items-center space-x-6 group'>
                            <div className='bg-gray-300 w-2/5 aspect-square h-full rounded-2xl'>

                            </div>
                            <div className='flex flex-col justify-start space-y-1 w-3/5'>
                                <div className='text-lg text-gray-900 font-semibold group-hover:underline decoration-indigo:underline'>Lorem ipsum dolor sit.</div>
                                <div className='text-xs text-gray-700'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, molestiae. Eaque sequi exercitationem repudiandae sint quae sunt reiciendis natus odio.</div>
                                <div>
                                    <div className='flex w-full space-x-1 items-center'>
                                        <div className='rounded-full bg-gray-300 h-8 w-8 flex-none'></div>
                                        <div className='flex text-sm font-semibold'>
                                            Djamila BAROUDI &#x2022;
                                        </div>
                                        <div > 17 Feb. 2023</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </aside>
    )
}

export default SideSection