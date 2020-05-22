import React, { useEffect } from "react"
import "./App.scss"
import data from "./data/export.json"
import { parseData } from "./utils/catchme"
import CatchMeProvider from "./providers/catchme.provider"
import RouteList from "./components/route-list"

function App() {
  useEffect(() => {
    parseData(data as any)
  }, [])

  return (
    <CatchMeProvider>
      <div className="App">
        <h1>
          Catch me manager <span id="app-version">0.1.0</span>
        </h1>
        <br />

        <RouteList />
      </div>
    </CatchMeProvider>
  )
}

export default App
