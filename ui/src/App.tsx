import React from "react"
import "./App.scss"
import CatchMeProvider from "./providers/catchme.provider"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import RoutePage from "./pages/RoutePage/RoutePage"
import logo from "./assets/logo120.png"
import logo_colored from "./assets/logo_colored120.png"
import Footer from "./components/Footer/Footer"
import Map from "./components/Map/Map"
import GtfsInfo from "./components/GtfsInfo/GtfsInfo"
import UploadData from "./pages/UploadData/UploadData"
import Error404 from "./pages/404/404"

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
      <Link style={{ display: "flex", alignItems: "center" }} to="/">
        <div className="logo">
          <img id="logo" src={logo} alt="Logo" />
          <img id="logo_colored" src={logo_colored} alt="Logo" />
        </div>

        <h1 id="main-title">
          Catch Me
          <span id="creator"> Creator</span>
        </h1>
      </Link>

      <Link id="upload-link" to="/upload">
        Upload new data
      </Link>

      <h3 id="app-version">0.2.0</h3>
    </header>
  )
}

const AppRouter: React.FC = () => {
  return (
    <div className="AppRoot">
      <CatchMeProvider>
        <Router>
          <AppHeader />
          <Switch>
            <Route exact component={Home} path="/" />
            <Route exact component={UploadData} path="/upload" />
            <Route component={RoutePage} path="/routes/:routeId" />
            <Route component={Error404} />
          </Switch>
        </Router>
      </CatchMeProvider>
      <Footer />
    </div>
  )
}

export default AppRouter
