import React, { useState, ChangeEvent, FormEvent } from 'react';

import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/String'
import { pipe } from 'fp-ts/function'

interface Props {
    allItems: string[]
    additionalItems: string[]
    onSubmitted: (additionalItems: string[]) => void
}

export default function Inputting({ allItems, additionalItems: unsortedItems, onSubmitted }: Props): JSX.Element {
    const [text, setText] = useState(unsortedItems.join("\n"));

    function optionsFromText(text: string): string[] {
        const arr = text.split("\n")
        return A.filter(e => e != "")(arr)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmitted(optionsFromText(text))
    };

    const sortedItems = pipe(allItems, A.difference(S.Eq)(unsortedItems))

    const sortedOptionsList = sortedItems.length > 0 && (
        <ul>
            {
                sortedItems.map((s) =>
                    <ol>{s}</ol>
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
                {sortedOptionsList}
                <textarea
                    className="block p-2.5 w-full h-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={text}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value)}
                    placeholder="Enter options to be sorted, one per line"
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
