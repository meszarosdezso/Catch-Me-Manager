import React from "react"
import { useCatchMe } from "../providers/catchme.provider"

const RouteList: React.FC = () => {
  const { data } = useCatchMe()

  return (
    <div className="RouteList">
      {Object.keys(data).map((routeId, i) => (
        <div key={routeId + i} className="Route">
          <h3 style={{ color: data[routeId].color || "#000000" }}>
            {data[routeId].name}
          </h3>
          <ul>
            {data[routeId].stops.map((s, i) => (
              <li key={routeId + i}>{s.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default RouteList
