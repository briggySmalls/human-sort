import { ComparisonResult } from './Comparison'
import { StateManager } from './State'

interface InitAction {
    type: "init"
    options: string[]
    sortedOptions: string[]
}

interface ComparedAction {
    type: "compared"
    result: ComparisonResult<string>
}

interface UndoAction {
    type: "undo"
}

type Action = InitAction | ComparedAction | UndoAction


function reduceState<A extends Action>(state: StateManager<string>, action: A): StateManager<string> {
    switch (action.type) {
        case "init": { return StateManager.init(action.options, action.sortedOptions) }
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
