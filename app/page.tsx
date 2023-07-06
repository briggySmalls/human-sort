"use client";

import React, { useState } from 'react';

import Sorting from './components/sorting'
import Inputting from './components/inputting'

enum AppState {
  Inputting,
  Sorting,
  Complete
}

export default function Home() {
  const [appState, setAppState] = useState(AppState.Inputting)
  const [options, setOptions] = useState(new Array<String>())

  function onSubmitted(items: String[]) {
    setOptions(items)
    setAppState(AppState.Sorting)
  }

  function createAppComponent(appState: AppState): JSX.Element {
    switch (appState) {
      case (AppState.Inputting):
        return (
          <Inputting onSubmitted={onSubmitted} />
        )
      case (AppState.Sorting):
        return (
          <Sorting options={options} />
        )
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="place-items-center text-align-center">
        <h1>human-sort</h1>
        <h2>relative sorting made simple</h2>
        {createAppComponent(appState)}
      </div>
    </main >
  )
}
