"use client";

import React, { useState, useReducer } from 'react';

import { StateManager } from './lib/State'
import { reduceState } from './lib/Reducer'

import Sorting from './components/sorting'
import Inputting from './components/inputting'

enum AppState {
  Inputting,
  Sorting,
  Complete
}

export default function Home() {
  const initialState: StateManager<String> = StateManager.init(new Array<String>())
  const [state, reducer] = useReducer(reduceState, initialState)
  const [appState, setAppState] = useState(AppState.Inputting)

  function onSubmitted(items: String[], sortedItems:  String[]) {
    reducer({type: "init", options: items, sortedOptions: sortedItems})
    setAppState(AppState.Sorting)
  }

  function backToInputting() { setAppState(AppState.Inputting) }

  function createAppComponent(appState: AppState): JSX.Element {
    switch (appState) {
      case (AppState.Inputting):
        return (
          <Inputting options={state.uninsertedElements} sortedOptions={state.data.tree.sorted()} onSubmitted={onSubmitted} />
        )
      case (AppState.Sorting):
        return (
          <Sorting state={state} reducer={reducer} onBack={backToInputting} />
        )
      default:
        return (<></>)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">human-sort</h1>
        <h2 className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">relative sorting made simple</h2>
        {createAppComponent(appState)}
      </div>
    </main >
  )
}
