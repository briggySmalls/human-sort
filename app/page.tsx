"use client";

import { useReducer } from 'react';
import { StateManager } from './lib/State'
import * as O from 'fp-ts/Option'
import { EmptyTree } from './lib/Tree'
import Sorting from './components/sorting'
import { reduceState } from './lib/Reducer'

enum AppState {
  Input,
  Sorting,
  Complete
}

export default function Home() {
  const options = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
  ]
  const initialState: StateManager<String> = new StateManager<String>(
    {
      tree: new EmptyTree<String>,
      nextComparison: O.none,
      comparisonResults: [],
      elementsToInsert: options,
    }
  )
  console.log(initialState.data)

  const [state, dispatch] = useReducer(reduceState, initialState)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="place-items-center text-align-center">
        <h1>human-sort</h1>
        <h2>relative sorting made simple</h2>
        <Sorting state={state} reducer={dispatch} />
      </div>
    </main >
  )
}
