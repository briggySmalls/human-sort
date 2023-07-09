import { ComparisonResult } from './Comparison'
import { StateManager } from './State'

interface ComparedAction {
    type: "compared"
    result: ComparisonResult<String>
}

type Action = ComparedAction


function reduceState<A extends Action>(state: StateManager<String>, action: A): StateManager<String> {
    switch (action.type) {
        case "compared": {
            // Add the new comparison results
            const newState = state.addComparison(action.result)
            // Re-attempt inserting the new element
            return newState.iterate(action.result.elem)
        }
    }
}

export type {
    Action
}

export {
    reduceState
}