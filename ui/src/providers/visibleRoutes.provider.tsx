import React, { useState, useContext } from 'react'
import { createContext } from 'react'
import { RoutesByColors, Route, Stop } from '../interfaces'

type Props = {
  visibleRoutes: RoutesByColors
  setVisibleRoutes: React.Dispatch<React.SetStateAction<RoutesByColors>>
  selectedRoute: Route
  setSelectedRoute: React.Dispatch<React.SetStateAction<Route>>
  selectedStop: Stop
  setSelectedStop: React.Dispatch<React.SetStateAction<Stop>>
}

const VisibleRoutesContext = createContext<Props>({} as Props)

const VisibleRoutesProvider: React.FC<{ initialRoutes: RoutesByColors }> = ({
  children,
  initialRoutes,
}) => {
  const [visibleRoutes, setVisibleRoutes] = useState<RoutesByColors>(
    initialRoutes
  )
  const [selectedStop, setSelectedStop] = useState<Stop>({} as Stop)
  const [selectedRoute, setSelectedRoute] = useState<Route>({} as Route)

  return (
    <VisibleRoutesContext.Provider
      value={{
        visibleRoutes,
        setVisibleRoutes,
        selectedRoute,
        setSelectedRoute,
        selectedStop,
        setSelectedStop,
      }}
    >
      {children}
    </VisibleRoutesContext.Provider>
  )
}

export default VisibleRoutesProvider

export const VisibleRoutesConsumer = VisibleRoutesContext.Consumer

export const useVisibleRoutes = () => useContext(VisibleRoutesContext)
