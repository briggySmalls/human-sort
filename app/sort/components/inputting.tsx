import React, { useState, useRef, FormEvent, KeyboardEvent } from 'react';

import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/String'
import { pipe } from 'fp-ts/function'

interface Props {
    allItems: string[]
    additionalItems: string[]
    onSubmitted: (additionalItems: string[]) => void
}

export default function Inputting({ allItems, additionalItems: unsortedItems, onSubmitted }: Props): JSX.Element {
    const [items, setItems] = useState(allItems);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    function optionsFromText(text: string): string[] {
        const arr = text.split("\n")
        return pipe(
            arr,
            A.filter(e => e != ""),
            A.uniq(S.Eq)
        )
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const mergedItems = mergeItemsWithText(textAreaRef?.current?.value)
        console.log(mergedItems)
        onSubmitted(mergedItems)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            const text = event.currentTarget.value
            updateItems(text)
            event.currentTarget.value = ""
            event.preventDefault()
        }
    };

    const updateItems = (text: string) => {
        const mergedItems = mergeItemsWithText(text)
        setItems(mergedItems)
    }

    const mergeItemsWithText = (text: string | null | undefined): string[] => {
        if (text) {
            const additionalOptions = optionsFromText(text)
            return pipe(items, A.concat(additionalOptions))
        }
        return items
    }

    const handleItemDelete = (item: string) => {
        return () => setItems(pipe(items, A.filter((s) => s !== item)))
    }

    const optionsList = items.length > 0 && (
        <ul>
            {
                items.map((s) =>
                    <ol key={s}>{s}<button className="ml-2" onClick={handleItemDelete(s)}>🗑️</button></ol>
                )
            }
        </ul>
    )

    return (
        <div className="w-full h-full">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Input
            </h1>
            <h2 className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                Provide elements to be sorted
            </h2>
            <form onSubmit={handleSubmit}>
                {optionsList}
                <textarea
                    className="block p-2.5 w-full h-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onKeyDown={handleKeyDown}
                    placeholder="Enter options to be sorted, one per line"
                    ref={textAreaRef}
                />
                <button
                    className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );

}
