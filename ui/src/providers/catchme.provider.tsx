import React, { useEffect, useState, useContext } from "react"
import { CatchMeData } from "../interfaces"
import { createContext } from "react"
import { parseData } from "../utils/catchme"
import UploadData from "../pages/UploadData/UploadData"
import LoadingPage from "../pages/Loading/Loading"

interface Props extends CatchMeData {
  uploadData(data: any): void
}

const CatchMeContext = createContext<Props>({} as Props)

const CatchMeProvider: React.FC = ({ children }) => {
  const [{ data, loading, noData }, setState] = useState<{
    noData: boolean
    data: CatchMeData
    loading: boolean
  }>({ data: {} as CatchMeData, loading: true, noData: false })

  useEffect(() => {
    fetchData().then((data) => {
      setState({
        data: parseData(data),
        loading: false,
        noData: data === null,
      })
    })
  }, [])

  const fetchData = async () => {
    try {
      const file = await fetch("./export.json") //! Typo for testing
      return await file.json()
    } catch {
      return null
    }
  }

  const uploadData = (data: any) => {
    setState({ data: parseData(data), loading: false, noData: false })
  }

  return (
    <CatchMeContext.Provider
      value={{
        uploadData,
        ...data,
      }}
    >
      {loading ? <LoadingPage /> : noData ? <UploadData /> : children}
    </CatchMeContext.Provider>
  )
}

export default CatchMeProvider

export const useCatchMe = () => useContext(CatchMeContext)
