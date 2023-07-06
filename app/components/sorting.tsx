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
}

export default function Sorting({ options }: Props): JSX.Element {
    const initialState: StateManager<String> = new StateManager<String>(
        {
            tree: new EmptyTree<String>,
            nextComparison: O.none,
            comparisonResults: [],
            elementsToInsert: options,
        }
    )

    const [state, reducer] = useReducer(reduceState, initialState)

    return (
        <>
            {
                O.match(
                    () => <div>Sorting complete!</div>,
                    (cmp: Comparison<String>) => <Compare comparison={cmp} onCompare={(cr: ComparisonResult<String>) => reducer({ type: "compared", result: cr })} />
                )(state.data.nextComparison)
            }
            < ul id="list" >
                {
                    state.data.tree.sorted().map((elem: String) =>
                        <li>{elem.toString()}</li>
                    )
                }
            </ul >
        </>
    )
}