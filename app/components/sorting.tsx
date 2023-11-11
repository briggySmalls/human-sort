import { StateManager } from '../lib/State'
import { Comparison, ComparisonResult } from '../lib/Comparison'
import { Action } from '../lib/Reducer'
import * as O from 'fp-ts/Option'
import Compare from './compare'
import { useReducer } from 'react';
import { reduceState } from '../lib/Reducer'
import { EmptyTree } from '../lib/Tree'

interface Props {
    options: String[]
    onBack: () => void
}

export default function Sorting({ options, onBack }: Props): JSX.Element {
    const initialState: StateManager<String> = StateManager.init(options)

    const [state, reducer] = useReducer(reduceState, initialState)

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