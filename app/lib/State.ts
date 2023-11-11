import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import { Tree, EmptyTree } from './Tree'
import { Comparison, ComparisonResult } from './Comparison'

/**
 * State that evolves whilst sorting
 */
interface State<T> {
    tree: Tree<T>
    nextComparison: O.Option<Comparison<T>>
    comparisonResults: ComparisonResult<T>[]
    elementsToInsert: T[]
    elementsInserted: number
}

/**
 * Manager for state evolution
 */
class StateManager<T> {
    public readonly data: State<T>

    constructor(state: State<T>, normalise: Boolean = true) {
        if (normalise) {
            this.data = tryInsertNext(state)
        } else {
            this.data = state
        }
    }

    /**
     * Helper function for initialising state with a set of options
     * @param options Options to be sorted
     * @returns A new state manager
     */
    static init<T>(options: T[]): StateManager<T> {
        return new StateManager({
            tree: new EmptyTree<T>,
            nextComparison: O.none,
            comparisonResults: [],
            elementsToInsert: options,
            elementsInserted: 0,
        }, true)
    }

    /**
     * Attempt to iterate state (inserting an element to the tree)
     * @param elem Element to be inserted
     * @returns The iterated state
     */
    public iterate(elem: T): StateManager<T> {
        return new StateManager(iterate(this.data, elem), false)
    }

    /**
     * Add the outcome of a human comparison
     * @param cr result of comparison
     * @returns The state, with comparison added
     */
    public addComparison(cr: ComparisonResult<T>): StateManager<T> {
        const newState = {
            ...this.data,
            comparisonResults: A.append(cr)(this.data.comparisonResults)
        }
        return new StateManager(newState, false)
    }
}

/**
 * Inserts the next element to the tree, if possible
 * @param state The current state
 * @returns The state, iterated
 */
function tryInsertNext<T>(state: State<T>): State<T> {
    const maybeElementToInsert = A.lookup(state.elementsInserted)(state.elementsToInsert)
    console.log(maybeElementToInsert)
    return O.match(
        () => {
            // There are no more elements to insert!
            return {
                ...state,
                nextComparison: O.none
            }
        },
        (next: T) => {
            // We've got more elements to insert
            return iterate(state, next)
        }
    )(maybeElementToInsert)
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
                tree: tree,
                elementsInserted: state.elementsInserted + 1,
            }
            // Proceed until we need user input (or we're complete!)
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
