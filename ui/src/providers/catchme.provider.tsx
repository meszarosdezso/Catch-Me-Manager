import React, { useEffect, useState, useContext } from "react"
import { CatchMeData, Route } from "../interfaces"
import { createContext } from "react"
import jsonData from "../data/export.json"
import { parseData } from "../utils/catchme"

export interface Props {
  data: CatchMeData
  getRoute(id: string): Route
}

const CatchMeContext = createContext<Props>({} as Props)

const CatchMeProvider: React.FC = ({ children }) => {
  const [{ data, loading }, setState] = useState<{
    data: CatchMeData
    loading: boolean
  }>({ data: {}, loading: true })

  useEffect(() => {
    setState({ data: parseData(jsonData), loading: false })
  }, [])

  const getRoute = (routeId: string): Route => {
    return data[routeId]
  }

  return loading ? (
    <h1>Loading data...</h1>
  ) : (
    <CatchMeContext.Provider value={{ data, getRoute } as Props}>
      {children}
    </CatchMeContext.Provider>
  )
}

export default CatchMeProvider

export const useCatchMe = () => useContext(CatchMeContext)
