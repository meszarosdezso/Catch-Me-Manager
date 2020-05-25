import React, { useState, useEffect } from "react"
import { useCatchMe } from "../../providers/catchme.provider"
import "./GtfsInfo.scss"
import { Link } from "react-router-dom"

const GtfsInfo: React.FC = () => {
  const { routes, stops, routesByColors } = useCatchMe()

  const [state, setState] = useState(0)

  useEffect(() => {
    console.log(routesByColors)
    const interval = setInterval(() => {
      setState((s) => (s + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="GtfsInfo">
      <h1>
        You have <br />{" "}
        <div style={{ opacity: state === 0 ? 1 : 0 }} className="route-num">
          <span className="amount accent">{Object.keys(routes).length}</span>
          <br />
          routes
        </div>
        <div style={{ opacity: state === 1 ? 1 : 0 }} className="stop-num">
          <span className="amount secondary">{Object.keys(stops).length}</span>
          <br />
          stops
        </div>
        <div style={{ opacity: state === 2 ? 1 : 0 }} className="color-num">
          <span className="amount">{Object.keys(routesByColors).length}</span>
          <br />
          colors
        </div>
      </h1>

      <Link id="start" to="/manage">
        Let's start
      </Link>
    </div>
  )
}

export default GtfsInfo
