import React, { useEffect, useState, useContext, useCallback } from 'react'
import { CatchMeData } from '../interfaces'
import { createContext } from 'react'
import { parseData } from '../utils/catchme'
import LoadingPage from '../pages/Loading/Loading'

interface Props extends CatchMeData {
  uploadData: (json: any) => void
}

const CatchMeContext = createContext<Props>({} as Props)

const CatchMeProvider: React.FC = ({ children }) => {
  const [{ data, loading }, setState] = useState<{
    data: CatchMeData | null
    loading: boolean
  }>({ data: {} as CatchMeData, loading: true })

  const loadData = useCallback(async () => {
    try {
      const file = await fetch('./data.json')
      const json = await file.json()

      return json
    } catch {
      return null
    }
  }, [])

  const uploadData = (json: any) => {
    setState({
      data: !json ? null : parseData(json),
      loading: false,
    })
  }

  useEffect(() => {
    setTimeout(() => {
      loadData().then(uploadData)
    }, 200)
  }, [loadData])

  return (
    <CatchMeContext.Provider
      value={{
        uploadData,
        agencies: data?.agencies || [],
        stops: data?.stops || {},
        routes: data?.routes || {},
        shapes: data?.shapes || {},
      }}
    >
      {loading ? <LoadingPage text="Loading the app..." /> : children}
    </CatchMeContext.Provider>
  )
}

export default CatchMeProvider

export const useCatchMe = () => useContext(CatchMeContext)
