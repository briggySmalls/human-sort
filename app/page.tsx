"use client";

import { useReducer } from 'react';
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import { Tree, EmptyTree } from './lib/Tree'
import { Comparison, ComparisonResult } from './lib/Comparison'

interface State<T> {
  tree: Tree<T>
  nextComparison: O.Option<Comparison<T>>
  comparisonResults: ComparisonResult<T>[]
  elementsToInsert: T[]
}

interface ComparedAction {
  type: "compared"
  result: Boolean
}

interface InitAction {
  type: "init"
}

type Action = ComparedAction | InitAction

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

function reduceState<A extends Action>(state: State<String>, action: A): State<String> {
  switch (action.type) {
    case "compared": {
      // Iterate the tree with the comparison results
      return O.match(
        () => { throw new Error("ComparedEvent raised but no comparison in progress") },
        // Add the new comparison result and iterate
        (comparison: Comparison<String>) => {
          const newState = {
            ...state,
            comparisonResults: A.append(
              new ComparisonResult(comparison.nodeValue, comparison.elem, action.result)
            )(state.comparisonResults)
          }
          return iterate(newState, comparison.elem)
        },
      )(state.nextComparison)
    }
    case "init":
      return tryInsertNext(state)
  }
}

export default function Home() {
  const options = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
  ]
  const initialState: State<String> = reduceState(
    {
      tree: new EmptyTree<String>,
      nextComparison: O.none,
      comparisonResults: [],
      elementsToInsert: options,
    },
    { type: "init" }
  )
  console.log(initialState)
  const [state, dispatch] = useReducer(reduceState, initialState)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="place-items-center text-align-center">
        <h1>human-sort</h1>
        <h2>relative sorting made simple</h2>
        {
          O.match(
            () => <div>Sorting complete!</div>,
            (cmp: Comparison<String>) =>
              <div id="controls" className="card">
                <div id="question">
                  <p>Which is larger?</p>
                </div>
                <button id="first" type="button" onClick={() => dispatch({ type: "compared", result: false })}>{cmp.elem}</button>
                <button id="second" type="button" onClick={() => dispatch({ type: "compared", result: true })}>{cmp.nodeValue}</button>
              </div>
          )(state.nextComparison)
        }
        <ul id="list">
          {
            state.tree.sorted().map((elem: String) =>
              <li>{elem}</li>
            )
          }
        </ul>
      </div>
    </main >
  )
}
