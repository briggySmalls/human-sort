import { ComparisonResult } from './Comparison'
import { StateManager } from './State'

interface ComparedAction {
    type: "compared"
    result: ComparisonResult<String>
}

interface UndoAction {
    type: "undo"
}

type Action = ComparedAction | UndoAction


function reduceState<A extends Action>(state: StateManager<String>, action: A): StateManager<String> {
    switch (action.type) {
        case "compared": { return state.addComparison(action.result) }
        case "undo": { return state.undo() }
    }
}

export type {
    Action
}

export {
    reduceState
}