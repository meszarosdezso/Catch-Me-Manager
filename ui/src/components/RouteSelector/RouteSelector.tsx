import React, { useCallback, useState } from 'react'
import { Route, RoutesByColors, RouteType } from '../../interfaces'
import { useCatchMe } from '../../providers/catchme.provider'
import { VisibleRoutesConsumer } from '../../providers/visibleRoutes.provider'
import './RouteSelector.scss'

const RouteSelector: React.FC = () => {
  const { routes } = useCatchMe()

  const routeTypes = [...new Set(Object.values(routes).map(r => r.type))]

  const [routeTypeFilter, setRouteTypeFilter] = useState(routeTypes[0])

  const toggleRoute = useCallback(
    (prev: RoutesByColors, route: Route): RoutesByColors => {
      const sameColoredRoutes = prev[route.color] || []
      if (sameColoredRoutes.includes(route.id)) {
        return {
          ...prev,
          [route.color]: [...sameColoredRoutes.filter(id => id !== route.id)],
        }
      } else
        return {
          ...prev,
          [route.color]: [...sameColoredRoutes, route.id],
        }
    },
    []
  )

  return (
    <VisibleRoutesConsumer>
      {({ visibleRoutes, setVisibleRoutes, setSelectedRoute }) => {
        return (
          <div className="RouteSelector">
            <select
              onChange={e => setRouteTypeFilter(+e.target.value)}
              name=""
              id="RouteTypeFilter"
            >
              {routeTypes.map(t => (
                <option key={t} value={t}>
                  {RouteType[t]}
                </option>
              ))}
            </select>

            <br />
            <div id="RouteList">
              {Object.values(routes)
                .filter(r => r.type === routeTypeFilter)
                .sort(
                  (r1, r2) =>
                    +r1.short_name.replace(/\D/g, ' ') -
                    +r2.short_name.replace(/\D/g, ' ')
                )
                .map(route => (
                  <div
                    key={route.id}
                    onClick={_ => {
                      setVisibleRoutes(prevState =>
                        toggleRoute(prevState, route)
                      )
                      if (visibleRoutes[route.color]?.includes(route.id)) {
                        setSelectedRoute({} as Route)
                      } else {
                        setSelectedRoute(route)
                      }
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
                    <p>{route.short_name}</p>
                  </div>
                ))}
            </div>
            <br />
            <button
              className="full"
              onClick={_ => {
                setVisibleRoutes({})
                setSelectedRoute({} as Route)
              }}
            >
              Deselect all
            </button>
          </div>
        )
      }}
    </VisibleRoutesConsumer>
  )
}

export default RouteSelector
