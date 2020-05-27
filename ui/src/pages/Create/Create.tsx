import React from "react"
import Layout from "../../components/Layout/Layout"
import { useCatchMe } from "../../providers/catchme.provider"
import "./Create.scss"
import CatchMeMap from "../../components/CatchMeMap/CatchMeMap"
import VisibleRoutesProvider, {
  VisibleRoutesConsumer,
} from "../../providers/visibleRoutes.provider"
import { Route, RoutesByColors } from "../../interfaces"

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
            {([visible, setVisible, _, setSelectedRoute]) => {
              return (
                <div id="RouteList">
                  {Object.values(routes).map((route) => (
                    <div
                      key={route.id}
                      onClick={(_) => {
                        setSelectedRoute(route)
                        setVisible((prevState) => toggleRoute(prevState, route))
                      }}
                      className="RouteListItem"
                      style={{
                        background: route.color,
                        color: route.text_color,
                        opacity: visible[route.color]?.includes(route.id)
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
            {([_, __, route]) => (
              <div id="SelectedRoute">
                <h2 className="title">{route.name}</h2>
              </div>
            )}
          </VisibleRoutesConsumer>
        </VisibleRoutesProvider>
      </div>
    </Layout>
  )
}

export default CreatePage
