import React from 'react'
import './App.scss'
import CatchMeProvider, { useCatchMe } from './providers/catchme.provider'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import GtfsInfo from './components/GtfsInfo/GtfsInfo'
import UploadData from './pages/UploadData/UploadData'
import Error404 from './pages/404/404'
import Changelog from './pages/Changelog/Changelog'
import ChangelogProvider from './providers/changelog.provider'
import Layout from './components/Layout/Layout'
import CreatePage from './pages/Create/Create'
import CatchMeMap from './components/CatchMeMap/CatchMeMap'
import VisibleRoutesProvider from './providers/visibleRoutes.provider'
import { groupRoutesByColors } from './utils/catchme'
import SelectPage from './pages/SelectData/SelectData'

function Home() {
  const { routes } = useCatchMe()

  if (!Object.keys(routes).length) return <Redirect to="/upload" />

  return (
    <Layout>
      <div className="Home">
        <GtfsInfo />
        <VisibleRoutesProvider initialRoutes={groupRoutesByColors(routes)}>
          <CatchMeMap style={{ height: '60vh' }} />
        </VisibleRoutesProvider>
      </div>
    </Layout>
  )
}

const AppRouter: React.FC = () => {
  return (
    <div className="AppRoot">
      <Router>
        <CatchMeProvider>
          <ChangelogProvider>
            <Switch>
              <Route exact component={Home} path="/" />
              <Route exact component={UploadData} path="/upload" />
              <Route exact component={SelectPage} path="/select" />
              <Route exact component={Changelog} path="/changelog" />
              <Route exact component={CreatePage} path="/create" />
              <Route component={Error404} />
            </Switch>
          </ChangelogProvider>
        </CatchMeProvider>
      </Router>
    </div>
  )
}

export default AppRouter
