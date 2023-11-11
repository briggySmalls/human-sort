import { ComparisonResult } from './Comparison'
import { StateManager } from './State'

interface InitAction {
    type: "init"
    options: String[]
}

interface ComparedAction {
    type: "compared"
    result: ComparisonResult<String>
}

interface UndoAction {
    type: "undo"
}

type Action = InitAction | ComparedAction | UndoAction


function reduceState<A extends Action>(state: StateManager<String>, action: A): StateManager<String> {
    switch (action.type) {
        case "init": { return StateManager.init(action.options) }
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