import { ComparisonResult } from './Comparison'
import { StateManager } from './State'

interface ComparedAction {
    type: "compared"
    result: ComparisonResult<String>
}

type Action = ComparedAction


function reduceState<A extends Action>(state: StateManager<String>, action: A): StateManager<String> {
    switch (action.type) {
        case "compared": { return state.addComparison(action.result) }
    }
}

export type {
    Action
}

export {
    reduceState
}