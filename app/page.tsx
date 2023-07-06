"use client";

import { useReducer } from 'react';
import { StateManager } from './lib/State'
import * as O from 'fp-ts/Option'
import { EmptyTree } from './lib/Tree'
import { Comparison, ComparisonResult } from './lib/Comparison'
import Compare from './components/Compare'

enum AppState {
  Input,
  Sorting,
  Complete
}

interface ComparedAction {
  type: "compared"
  result: ComparisonResult<String>
}

type Action = ComparedAction


function reduceState<A extends Action>(state: StateManager<String>, action: A): StateManager<String> {
  switch (action.type) {
    case "compared": {
      // Add the new comparison results
      const newState = state.addComparison(action.result)
      // Re-attempt inserting the new element
      return newState.iterate(action.result.elem)
    }
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
        {
          O.match(
            () => <div>Sorting complete!</div>,
            (cmp: Comparison<String>) => <Compare comparison={cmp} onCompare={(cr: ComparisonResult<String>) => dispatch({ type: "compared", result: cr })} />
          )(state.data.nextComparison)
        }
        <ul id="list">
          {
            state.data.tree.sorted().map((elem: String) =>
              <li>{elem}</li>
            )
          }
        </ul>
      </div>
    </main >
  )
}
