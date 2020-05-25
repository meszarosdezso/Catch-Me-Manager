import { useState, useMemo } from "react"

export default function useFetch(url: string) {
  const [{ data, loading }, setState] = useState<{
    data: any
    loading: boolean
  }>({ data: null, loading: true })

  useMemo(async () => {
    const res = await fetch(url)
    const data = await res.json()
    setState({ data, loading: false })
  }, [url])

  return [loading, data]
}
