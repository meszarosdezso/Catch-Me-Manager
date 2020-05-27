import React, { useState, useContext } from "react"
import { createContext } from "react"
import { RoutesByColors, Route } from "../interfaces"

type Props = [
  RoutesByColors,
  React.Dispatch<React.SetStateAction<RoutesByColors>>,
  Route,
  React.Dispatch<React.SetStateAction<Route>>
]

const VisibleRoutesContext = createContext<Props>({} as Props)

const VisibleRoutesProvider: React.FC<{ initialRoutes: RoutesByColors }> = ({
  children,
  initialRoutes,
}) => {
  const [visibleRoutes, setVisibleRoutes] = useState<RoutesByColors>(
    initialRoutes
  )

  const [selectedRoute, setSelectedRoute] = useState<Route>({} as Route)

  return (
    <VisibleRoutesContext.Provider
      value={[visibleRoutes, setVisibleRoutes, selectedRoute, setSelectedRoute]}
    >
      {children}
    </VisibleRoutesContext.Provider>
  )
}

export default VisibleRoutesProvider

export const VisibleRoutesConsumer = VisibleRoutesContext.Consumer

export const useVisibleRoutes = () => useContext(VisibleRoutesContext)
