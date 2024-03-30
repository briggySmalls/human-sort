import { ComparisonResult } from './Comparison'
import { StateManager } from './State'

interface InitAction {
    type: "init"
    options: string[]
    sortedOptions: string[]
}

interface UpdateElementsAction {
    type: "updateElements"
    options: string[]
}

interface ComparedAction {
    type: "compared"
    result: ComparisonResult<string>
}

interface UndoAction {
    type: "undo"
}

type Action = InitAction | UpdateElementsAction | ComparedAction | UndoAction


function reduceState<A extends Action>(state: StateManager<string>, action: A): StateManager<string> {
    switch (action.type) {
        case "init": { return StateManager.init(action.options, action.sortedOptions) }
        case "updateElements": { return state.updateElements(action.options) }
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
