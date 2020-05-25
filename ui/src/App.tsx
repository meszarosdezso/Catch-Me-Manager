import React from "react"
import "./App.scss"
import CatchMeProvider from "./providers/catchme.provider"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import RoutePage from "./pages/RoutePage/RoutePage"
import Footer from "./components/Footer/Footer"
import Map from "./components/Map/Map"
import GtfsInfo from "./components/GtfsInfo/GtfsInfo"
import UploadData from "./pages/UploadData/UploadData"
import Error404 from "./pages/404/404"
import Header from "./components/Header/Header"
import Changelog from "./pages/Changelog/Changelog"
import ChangelogProvider from "./providers/changelog.provider"

function Home() {
  return (
    <div className="Home">
      <GtfsInfo />
      <Map />
    </div>
  )
}

const AppRouter: React.FC = () => {
  return (
    <div className="AppRoot">
      <Router>
        <CatchMeProvider>
          <ChangelogProvider>
            <Header />
            <Switch>
              <Route exact component={Home} path="/" />
              <Route exact component={UploadData} path="/upload" />
              <Route exact component={Changelog} path="/changelog" />
              <Route component={RoutePage} path="/routes/:routeId" />
              <Route component={Error404} />
            </Switch>
          </ChangelogProvider>
        </CatchMeProvider>
      </Router>
      <Footer />
    </div>
  )
}

export default AppRouter
