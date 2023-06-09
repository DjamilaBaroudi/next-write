
import React, { useMemo } from 'react'
import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { HiCheck } from 'react-icons/hi'
import { HiChevronUpDown } from 'react-icons/hi2'
import type { Tag } from '../WriteFormModal'

type TagsAutoCompletionProps = {
    tags: Tag[]
    setselectedTags: React.Dispatch<React.SetStateAction<Tag[]>>
    selectedTags: Tag[]
};
export default function TagsAutocompletion({ tags, setselectedTags, selectedTags }: TagsAutoCompletionProps) {
    const [selected, setSelected] = useState(tags[0])
    const [query, setQuery] = useState('')

    const filteredTags = useMemo(() => {
        return query === ''
            ? tags
            : tags.filter((tag) =>
                tag.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )
    }, [query, tags])
    return (
        <Combobox value={selected} onChange={(tag) => {
            setSelected(tag)
            setselectedTags(prev => prev.includes(tag) ? [...prev] : [...prev, tag])
        }
        }>
            <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm">
                    <Combobox.Input
                        className="w-full outline-none border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue={(tag: { name: string }) => tag.name}
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
                        {filteredTags.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            filteredTags.map((tag) => (
                                <Combobox.Option
                                    key={tag.id}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#e5acb6] text-white' : 'text-gray-900'
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
                                                {tag.name}
                                            </span>
                                            {selectedTags.includes(tag) ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-gray-600'
                                                        }`}
                                                >
                                                    <HiCheck className="h-5 w-5" aria-hidden="true" color='#e5acb6' />
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


