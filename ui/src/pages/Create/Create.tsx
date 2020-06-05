import React from "react"
import Layout from "../../components/Layout/Layout"
import { useCatchMe } from "../../providers/catchme.provider"
import "./Create.scss"
import CatchMeMap from "../../components/CatchMeMap/CatchMeMap"
import VisibleRoutesProvider, {
  VisibleRoutesConsumer,
} from "../../providers/visibleRoutes.provider"
import { Route, RoutesByColors, Stop } from "../../interfaces"

const CreatePage: React.FC = () => {
  const { routes } = useCatchMe()

  const toggleRoute = (prev: RoutesByColors, route: Route): RoutesByColors => {
    const sameColoredRoutes = prev[route.color] || []
    if (sameColoredRoutes.includes(route.id)) {
      return {
        ...prev,
        [route.color]: [...sameColoredRoutes.filter((id) => id !== route.id)],
      }
    } else
      return {
        ...prev,
        [route.color]: [...sameColoredRoutes, route.id],
      }
  }

  return (
    <Layout showUpload={false} title="Create">
      <div className="CreatePage">
        <VisibleRoutesProvider initialRoutes={{}}>
          <VisibleRoutesConsumer>
            {({ visibleRoutes, setVisibleRoutes, setSelectedRoute }) => {
              return (
                <div id="RouteList">
                  {Object.values(routes).map((route) => (
                    <div
                      key={route.id}
                      onClick={(_) => {
                        setSelectedRoute(route)
                        setVisibleRoutes((prevState) =>
                          toggleRoute(prevState, route)
                        )
                      }}
                      className="RouteListItem"
                      style={{
                        background: route.color,
                        color: route.text_color,
                        opacity: visibleRoutes[route.color]?.includes(route.id)
                          ? 1
                          : 0.5,
                      }}
                    >
                      <p>{route.name}</p>
                    </div>
                  ))}
                </div>
              )
            }}
          </VisibleRoutesConsumer>

          <CatchMeMap id="CreateMap" />

          <VisibleRoutesConsumer>
            {({ selectedRoute: route, setSelectedStop: setStop }) => {
              if (route.name)
                return (
                  <div id="SelectedRoute">
                    <h2 className="title">
                      {route.name} (
                      {route.stops && Object.values(route.stops)[0].name} -{" "}
                      {route.stops &&
                        Object.values(route.stops).reverse()[0].name}
                      )
                    </h2>

                    <div className="stop-list">
                      <ul>
                        {route.stops.map((s) => (
                          <li
                            onMouseEnter={(e) => setStop(s)}
                            onMouseLeave={(e) => setStop({} as Stop)}
                            key={s.id}
                          >
                            {s.name}
                          </li>
                        ))}
                      </ul>
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
