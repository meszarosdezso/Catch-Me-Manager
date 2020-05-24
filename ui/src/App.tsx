import React from "react"
import "./App.scss"
import CatchMeProvider from "./providers/catchme.provider"
import { BrowserRouter as Router, Route } from "react-router-dom"
import RoutePage from "./components/RoutePage/RoutePage"
import logo from "./assets/logo120.png"
import Footer from "./components/Footer/Footer"
import Map from "./components/Map/Map"
import GtfsInfo from "./components/GtfsInfo/GtfsInfo"

function Home() {
  return (
    <div className="Home">
      <GtfsInfo />
      <Map />
    </div>
  )
}

const AppHeader: React.FC = () => {
  return (
    <header id="AppHeader">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <h1 id="main-title">
        Catch Me
        <span id="manager"> Manager</span>
      </h1>

      <h3 id="app-version">0.1.0</h3>
    </header>
  )
}

const AppRouter: React.FC = () => {
  return (
    <div className="AppRoot">
      <AppHeader />
      <CatchMeProvider>
        <Router>
          <Route exact component={Home} path="/" />
          <Route component={RoutePage} path="/:routeId" />
        </Router>
      </CatchMeProvider>
      <Footer />
    </div>
  )
}

export default AppRouter
