import React from "react"
import { useRouteMatch } from "react-router-dom"
import { useCatchMe } from "../../providers/catchme.provider"
import Error404 from "../404/404"

const RoutePage: React.FC = () => {
  const match = useRouteMatch<{ routeId: string }>()

  const { routes } = useCatchMe()

  const route = routes[match.params.routeId]

  return route ? (
    <div className="RoutePage">
      <h1>{route.name}</h1>

      <ul className="stop-list">
        {route.stops.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </div>
  ) : (
    <Error404 />
  )
}

export default RoutePage
