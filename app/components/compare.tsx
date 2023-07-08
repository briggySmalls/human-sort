import { Comparison, ComparisonResult } from '../lib/Comparison'

interface Props<T> {
    comparison: Comparison<T>
    onCompare: (cr: ComparisonResult<T>) => void
}

export default function Compare<T extends {}>({ comparison, onCompare }: Props<T>): JSX.Element {
    const inputs: [string, boolean][] = [
        [comparison.elem.toString(), false],
        [comparison.nodeValue.toString(), true]
    ]
    const buttons = inputs.map(([option, result]: [string, boolean]) => {
        return (
            <button
                id="first"
                type="button"
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                onClick={
                    () => onCompare(new ComparisonResult(comparison.nodeValue, comparison.elem, result))
                }
            >
                {option}
            </button>
        )
    })

    return (
        <div>
            <p className="text-center text-gray-500 dark:text-gray-400">Which is larger?</p>
            <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
                {buttons}
            </div>
        </div>
    )
}