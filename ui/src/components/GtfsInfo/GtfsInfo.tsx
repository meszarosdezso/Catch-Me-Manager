import React, { useState, useEffect } from "react"
import { useCatchMe } from "../../providers/catchme.provider"
import "./GtfsInfo.scss"

const GtfsInfo: React.FC = () => {
  const { routes, stops } = useCatchMe()

  const [state, setState] = useState(true)

  useEffect(() => {
    setInterval(() => {
      setState((s) => !s)
    }, 3000)
  }, [])

  return (
    <div className="GtfsInfo">
      <h1>
        You have <br />{" "}
        <div style={{ opacity: state ? 1 : 0 }} className="route-num">
          <span className="amount accent">{Object.keys(routes).length}</span>{" "}
          <br />
          routes
        </div>
        <div style={{ opacity: !state ? 1 : 0 }} className="stop-num">
          <span className="amount secondary">{stops.length}</span> <br />
          stops
        </div>
      </h1>
    </div>
  )
}

export default GtfsInfo
