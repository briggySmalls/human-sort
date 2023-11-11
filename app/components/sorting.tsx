import { StateManager } from '../lib/State'
import { Comparison, ComparisonResult } from '../lib/Comparison'
import { Action } from '../lib/Reducer'
import * as O from 'fp-ts/Option'
import Compare from './compare'

interface Props {
    state: StateManager<String>
    reducer: React.Dispatch<Action>
    onBack: () => void
}

export default function Sorting({ state, reducer, onBack }: Props): JSX.Element {
    function undo() { reducer({ type: "undo" }) }

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
                { state.canUndo ? (
                    <div>
                        <button
                            className="p-6 m-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            onClick={undo}>
                            ↩️ undo
                        </button>
                    </div>
                ) : (
                    <div>
                        <button
                            className="p-6 m-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            onClick={onBack}>
                            back
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}