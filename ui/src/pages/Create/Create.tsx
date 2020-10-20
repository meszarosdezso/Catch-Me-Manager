import React from 'react'
import Layout from '../../components/Layout/Layout'
import './Create.scss'
import CatchMeMap from '../../components/CatchMeMap/CatchMeMap'
import VisibleRoutesProvider, {
  VisibleRoutesConsumer,
} from '../../providers/visibleRoutes.provider'
import { Stop } from '../../interfaces'
import RouteSelector from '../../components/RouteSelector/RouteSelector'

const CreatePage: React.FC = () => {
  return (
    <Layout showUpload={false} title="Create">
      <div className="CreatePage">
        <VisibleRoutesProvider initialRoutes={{}}>
          <RouteSelector />

          <CatchMeMap id="CreateMap" />

          <VisibleRoutesConsumer>
            {({ selectedRoute: route, setSelectedStop: setStop }) => {
              if (!route.short_name) return <h4>Select a route to start!</h4>
              if (route.short_name)
                return (
                  <div id="SelectedRoute">
                    <h2 className="title">
                      {route.short_name} (
                      {route.stops && Object.values(route.stops)[0].name} -{' '}
                      {route.stops &&
                        Object.values(route.stops).reverse()[0].name}
                      )
                    </h2>

                    <div className="stop-list">
                      <ul>
                        {route.stops.map(s => (
                          <li
                            onMouseEnter={_ => setStop(s)}
                            onMouseLeave={_ => setStop({} as Stop)}
                            key={s.id}
                          >
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="buttons">
                      <button
                        style={{
                          background: route.color,
                          border: 'none',
                          color: route.text_color,
                        }}
                        className="full"
                      >
                        Save {route.short_name}
                      </button>
                      <button
                        style={{
                          background: 'none',
                          color: '#dd0000',
                          marginLeft: '1rem',
                          borderColor: '#dd0000',
                        }}
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )
            }}
          </VisibleRoutesConsumer>
        </VisibleRoutesProvider>
      </div>
    </Layout>
  )
}

export default CreatePage
