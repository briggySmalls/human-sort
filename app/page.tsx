"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, ChangeEvent } from 'react'

export default function Start() {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    function onUploadClick() {
        // `current` points to the mounted file input element
        inputFile?.current?.click();
    };
    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const files = event?.target?.files
        if (files !== null) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const contents = e?.target?.result as string
                const b64Contents = btoa(contents)
                router.push(`sort/?import=${b64Contents}`)
            };
            reader.readAsText(files[0])
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">human-sort</h1>
            <h2 className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">relative sorting made simple</h2>
            <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
                <Link href="/sort">
                    <button
                        id="new"
                        type="button"
                        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        Start
                    </button>
                </Link>
                <button
                    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    onClick={onUploadClick}>
                    Import
                    <input
                        type="file"
                        id="file-input"
                        ref={inputFile}
                        style={{ display: 'none' }}
                        accept=".csv"
                        onChange={onFileChange}
                    />
                </button>
            </div>
        </main >
    )
}
