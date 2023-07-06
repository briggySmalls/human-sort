import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import { Tree } from './Tree'
import { Comparison, ComparisonResult } from './Comparison'

interface State<T> {
    tree: Tree<T>
    nextComparison: O.Option<Comparison<T>>
    comparisonResults: ComparisonResult<T>[]
    elementsToInsert: T[]
}

class StateManager<T> {
    public readonly data: State<T>

    constructor(state: State<T>, normalise: Boolean = true) {
        if (normalise) {
            this.data = tryInsertNext(state)
        } else {
            this.data = state
        }
    }

    public iterate(elem: T): StateManager<T> {
        return new StateManager(iterate(this.data, elem), false)
    }

    public addComparison(cr: ComparisonResult<T>): StateManager<T> {
        const newState = {
            ...this.data,
            comparisonResults: A.append(cr)(this.data.comparisonResults)
        }
        return new StateManager(newState, false)
    }
}

function split<T>(arr: T[]): O.Option<[T, T[]]> {
    if (arr.length > 0) {
        const [head, tail] = A.splitAt(1)(arr)
        return O.some([head[0], tail])
    } else {
        return O.none
    }
}

/**
 * Inserts the next element to the tree, if possible
 */
function tryInsertNext<T>(state: State<T>): State<T> {
    const maybeElementsToInsert = split(state.elementsToInsert)
    console.log(maybeElementsToInsert)
    return O.match(
        () => {
            // There are no more elements to insert!
            return {
                ...state,
                nextComparison: O.none
            }
        },
        ([head, tail]: [T, T[]]) => {
            // We've got more elements to insert
            const newState = {
                ...state,
                elementsToInsert: tail
            }
            return iterate(newState, head)
        }
    )(maybeElementsToInsert)
}

/**
 * Iterates the state by trying to add the element to the tree
 * @param state The current state
 * @param elem The element to add
 * @returns The state, iterated
 */
function iterate<T>(state: State<T>, elem: T): State<T> {
    const treeOrComparison = state.tree.iterate(elem, state.comparisonResults)
    return E.match(
        (cmp: Comparison<T>) => {
            // We need to ask the user for another comparison
            return {
                ...state,
                nextComparison: O.some(cmp),
            }
        },
        (tree: Tree<T>) => {
            // We have successfully added the element to the tree
            const newState = {
                ...state,
                tree: tree
            }
            return tryInsertNext(newState)
        }
    )(treeOrComparison)
}

export type {
    State
}

export {
    StateManager
}
