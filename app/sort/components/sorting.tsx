import { StateManager } from '../../lib/State'
import { Comparison, ComparisonResult } from '../../lib/Comparison'
import { Action } from '../../lib/Reducer'
import * as O from 'fp-ts/Option'
import Compare from './compare'
import { toCsv } from '../../lib/Csv'

interface Props {
    state: StateManager<string>
    reducer: React.Dispatch<Action>
    onBack: () => void
}

export default function Sorting({ state, reducer, onBack }: Props): JSX.Element {
    function undo() { reducer({ type: "undo" }) }

    function controlButtonClassNames(isEnabled: Boolean): string {
        const primaryClasses: string = "m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        if (isEnabled) { return primaryClasses }
        else { return primaryClasses + " opacity-50 cursor-not-allowed" }
    }

    function csvDataEncodedURL() {
        const csv = toCsv(state.data)
        var data = new Blob([csv]);
        return URL.createObjectURL(data);
    }

    const mainContent =
        O.match(
            () => (<h2 className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                Sorting complete!
            </h2>
            ),
            (cmp: Comparison<string>) => (<>
                <h2 className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                    Which is larger?
                </h2>
                <Compare comparison={cmp} onCompare={(cr: ComparisonResult<string>) => reducer({ type: "compared", result: cr })} />
            </>
            )
        )(state.data.nextComparison)

    const sortedList = (
        <ul className="list-decimal block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700">
            {
                state.data.tree.sorted().map((elem: string, index: number) =>
                    <li key={index}>{elem.toString()}</li>
                )
            }
        </ul>
    )

    const controls = (
        <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-5">
            <div>
                <button
                    className={controlButtonClassNames(state.canUndo)}
                    onClick={undo}>
                    ↩️ undo
                </button>
            </div>
            <div>
                <button
                    className={controlButtonClassNames(true)}
                    onClick={onBack}>
                    back
                </button>
            </div>
            <div>
                <a
                    download="humansort.csv"
                    type='text/csv'
                    href={csvDataEncodedURL()}
                >
                    <button
                        className={controlButtonClassNames(true)}>
                        export
                    </button>
                </a>
            </div>
        </div>
    )

    return (
        <div className="h-full w-full">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Sort, human!</h1>
            {mainContent}
            <div>
                {sortedList}
                {controls}
            </div>
        </div>
    )
}
