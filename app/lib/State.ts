import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import * as EE from 'fp-ts/Eq'
import { Tree, EmptyTree } from './Tree'
import { Comparison, ComparisonResult } from './Comparison'
import { pipe } from 'fp-ts/function'
import { Stat } from '@chakra-ui/react'

/**
 * State that evolves whilst sorting
 */
interface State<T> {
    tree: Tree<T>
    nextComparison: O.Option<Comparison<T>>
    comparisonResults: ComparisonResult<T>[]
    allElementsCanonical: T[]
    elementsInserted: number
}

/**
 * Manager for state evolution
 */
class StateManager<T> {
    public readonly data: State<T>

    constructor(state: State<T>) {
        this.data = tryInsertNext(state)
    }

    /**
     * Helper function for initialising state with a set of options
     * @param allElementsCanonical Options to be sorted, in a canonical order
     * @returns A new state manager
     */
    static init<T>(allElementsCanonical: T[], sortedOptions: T[] = []): StateManager<T> {
        const pairs = getAllPairs(sortedOptions)
        const comparisonResults = pairs.map(ps => new ComparisonResult(ps[0], ps[1], false))
        return this.initWithComparisons(allElementsCanonical, comparisonResults)
    }

    static initWithComparisons<T>(allElementsCanonical: T[], comparisons: ComparisonResult<T>[]): StateManager<T> {
        const initialState = {
            tree: new EmptyTree<T>,
            nextComparison: O.none,
            comparisonResults: comparisons,
            allElementsCanonical: allElementsCanonical,
            elementsInserted: 0,
        }
        return new StateManager(initialState)
    }

    public get canUndo(): Boolean { return this.data.comparisonResults.length > 0 }

    public get uninsertedElements(): T[] { return A.dropLeft(this.data.elementsInserted)(this.data.allElementsCanonical) }

    public updateElements(newElements: T[]): StateManager<T> {
        // Determine which elements are being removed
        const toRemove = pipe(this.data.allElementsCanonical, A.difference(EE.eqStrict)(newElements)) as T[]
        // Strip out irrelevant comparisons
        const comparisons = pipe(
            this.data.comparisonResults,
            A.filter((cr) => !toRemove.includes(cr.elem) && !toRemove.includes(cr.nodeValue))
        )
        return StateManager.initWithComparisons(newElements, comparisons)
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
        return new StateManager(newState)
    }

    public undo(): StateManager<T> {
        const newState = {
            ...this.data,
            comparisonResults: A.dropRight(1)(this.data.comparisonResults),
            tree: new EmptyTree<T>, // Reset the tree
            elementsInserted: 0,    // Re-insert from the beginning
        }
        return new StateManager(newState)
    }
}

function getAllPairs<T>(arr: T[]): [T, T][] {
    function pairUpIfGreater(idx: number, candidate: T): [T, T][] {
        const arrOfMaybePairs: O.Option<[T, T]>[] = A.mapWithIndex((i: number, x: T) => {
            if (i > idx) {
                const t: [T, T] = [candidate, x]
                return O.some(t)
            }
            else return O.none
        })(arr)
        return A.compact(arrOfMaybePairs)
    }
    return A.flatten(A.mapWithIndex(pairUpIfGreater)(arr))
}

/**
 * Inserts the next element to the tree, if possible
 * @param state The current state
 * @returns The state, iterated
 */
function tryInsertNext<T>(state: State<T>): State<T> {
    const maybeElementToInsert = A.lookup(state.elementsInserted)(state.allElementsCanonical)
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
