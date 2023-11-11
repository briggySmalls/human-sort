import { StateManager } from '../lib/State'
import { Comparison, ComparisonResult } from '../lib/Comparison'
import { Action } from '../lib/Reducer'
import * as O from 'fp-ts/Option'
import Compare from './compare'
import { stat } from 'fs'

interface Props {
    state: StateManager<String>
    reducer: React.Dispatch<Action>
    onBack: () => void
}

export default function Sorting({ state, reducer, onBack }: Props): JSX.Element {
    function undo() { reducer({ type: "undo" }) }

    function controlButtonClassNames(isEnabled: Boolean): string {
        const primaryClasses: string = "m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        if (isEnabled) { return primaryClasses }
        else { return primaryClasses + " opacity-50 cursor-not-allowed"}
    }

    return (
        <>
            {
                O.match(
                    () => <div className="text-center m-6 text-gray-500 dark:text-gray-400">Sorting complete!</div>,
                    (cmp: Comparison<String>) => <Compare comparison={cmp} onCompare={(cr: ComparisonResult<String>) => reducer({ type: "compared", result: cr })} />
                )(state.data.nextComparison)
            }
            <div>
                <ul className="list-decimal block p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700">
                    {
                        state.data.tree.sorted().map((elem: String, index: number) =>
                            <li key={index}>{elem.toString()}</li>
                        )
                    }
                </ul>
                <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
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
                </div>
            </div>
        </>
    )
}