import React from "react"
import { useCatchMe } from "../../providers/catchme.provider"
import { Route } from "../../interfaces"
import "./RouteList.scss"
import { NavLink } from "react-router-dom"

const RouteList: React.FC = () => {
  const { routes } = useCatchMe()

  return (
    <div className="RouteList">
      {Object.keys(routes).map((routeId, i) => (
        <RouteTile key={routeId} {...routes[routeId]} />
      ))}
    </div>
  )
}

const RouteTile: React.FC<Route> = (route: Route) => {
  return (
    <NavLink to={`/${route.id}`}>
      <div
        style={{ backgroundColor: route.color || "#eee" }}
        className="RouteTile"
      >
        <h3 style={{ color: route.text_color }}>{route.name}</h3>
      </div>
    </NavLink>
  )
}

export default RouteList
