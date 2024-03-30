"use client";

import React, { useState, useReducer } from 'react';
import { useSearchParams } from 'next/navigation'

import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/String'
import { pipe } from 'fp-ts/function'

import { StateManager } from '../lib/State'
import { reduceState } from '../lib/Reducer'
import { fromCsv } from '../lib/Csv'

import Sorting from './components/sorting'
import Inputting from './components/inputting'

enum AppState {
  Inputting,
  Sorting,
  Complete
}

function parseState(encodedState: string): StateManager<string> {
  const decoded = Buffer.from(encodedState, 'base64').toString('utf-8')
  return fromCsv(decoded)
}

export default function Home() {
  const searchParams = useSearchParams()
  const imprt = searchParams.get('import')
  const initialState: StateManager<string> = (imprt !== null) ?
    parseState(imprt)
    : StateManager.init(new Array<string>())
  const [state, reducer] = useReducer(reduceState, initialState)
  const [appState, setAppState] = useState(AppState.Inputting)

  const allItems = state.data.allElementsCanonical
  const sortedItems = state.data.tree.sorted()
  const unsortedItems = pipe(allItems, A.difference(S.Eq)(sortedItems))

  function onSubmitted(userChosenItems: string[]) {
    reducer({ type: "updateElements", options: userChosenItems })
    setAppState(AppState.Sorting)
  }

  function backToInputting() { setAppState(AppState.Inputting) }

  function createAppComponent(appState: AppState): JSX.Element {
    switch (appState) {
      case (AppState.Inputting):
        return (
          <Inputting allItems={state.data.allElementsCanonical} additionalItems={unsortedItems} onSubmitted={onSubmitted} />
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-center w-9/12 mx-auto">
      {createAppComponent(appState)}
    </main >
  )
}
