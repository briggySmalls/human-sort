import { StateManager } from '../lib/State'
import { Comparison, ComparisonResult } from '../lib/Comparison'
import { Action } from '../lib/Reducer'
import * as O from 'fp-ts/Option'
import Compare from './compare'

interface Props {
    state: StateManager<String>
    reducer: (action: Action) => void
}

export default function Sorting({ state, reducer }: Props): JSX.Element {
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