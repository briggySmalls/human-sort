import React, { useState, ChangeEvent, FormEvent } from 'react';

import * as A from 'fp-ts/Array'

interface Props {
    options: String[]
    sortedOptions: String[]
    onSubmitted: (items: String[], sortedItems: String[]) => void
}

export default function Inputting({ options, sortedOptions, onSubmitted }: Props): JSX.Element {
    const [text, setText] = useState(options.join("\n"));
    const [sortedText, setSortedText] = useState(sortedOptions.join("\n"));

    function optionsFromText(text: String): String[] {
        const arr = text.split("\n")
        return A.filter(e => e != "")(arr)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmitted(optionsFromText(text), optionsFromText(sortedText))
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={text}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value)}
                placeholder="Enter options to be sorted, one per line"
            />
            <textarea
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={sortedText}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setSortedText(event.target.value)}
                placeholder="Enter options that are already sorted, one per line"
            />
            <button
                className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit"
            >
                Submit
            </button>
        </form>
    );

}
