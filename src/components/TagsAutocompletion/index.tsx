/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react'
import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { HiCheck } from 'react-icons/hi'
import { HiChevronUpDown } from 'react-icons/hi2'

type TagsType ={
    id: number;
    text: string;
}[] ;
const tags : TagsType = [
    { id: 1, text: 'Wade Cooper' },
    { id: 2, text: 'Arlene Mccoy' },
    { id: 3, text: 'Devon Webb' },
    { id: 4, text: 'Tom Cook' },
    { id: 5, text: 'Tanya Fox' },
    { id: 6, text: 'Hellen Schmidt' },
]

export default function TagsAutocompletion() {
    const [selected, setSelected] = useState(tags[0])
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? tags
            : tags.filter((tag) =>
                tag.text
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
            <Combobox value={selected} onChange={setSelected}>
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm">
                        <Combobox.Input
                            className="w-full outline-none border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(t:{name:string}) => t.name}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <HiChevronUpDown
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredPeople.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredPeople.map((tag) => (
                                    <Combobox.Option
                                        key={tag.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-600 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={tag}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {tag.text}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-gray-600'
                                                            }`}
                                                    >
                                                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
    )
}


