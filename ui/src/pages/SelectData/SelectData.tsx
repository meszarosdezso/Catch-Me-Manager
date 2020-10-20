import React, { useCallback, useEffect, useState } from 'react'
import './SelectData.scss'
import { useCatchMe } from '../../providers/catchme.provider'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { GitCommit, GitPullRequest } from 'react-feather'
import { PulseLoader } from 'react-spinners'
import { useHistory } from 'react-router-dom'

const SelectPage: React.FC = () => {
  const [state, setState] = useState<'LOADING' | 'READY'>('READY')

  const [dataList, setDataList] = useState<any[]>([])

  const { uploadData } = useCatchMe()

  const history = useHistory()

  const selectData = async (fileName: string) => {
    const { data } = await axios.get(`http://127.0.0.1:1873/gtfs/${fileName}`)
    uploadData(data)
    history.push('/')
  }

  const fetchAll = useCallback(async () => {
    const { data: files } = await axios.get('http://127.0.0.1:1873/gtfs')
    return files
  }, [])

  useEffect(() => {
    setState('LOADING')
    fetchAll()
      .then(setDataList)
      .then(_ => setState('READY'))
  }, [fetchAll])

  return (
    <Layout>
      <div className="SelectPage">
        <h2>Select one of your previously exported datasets:</h2>
        <br />

        {state === 'LOADING' ? (
          <PulseLoader />
        ) : (
          <ul className="catchme-data-list">
            {dataList.map(data => (
              <li
                onClick={_ => selectData(data.fileName)}
                key={data.agency}
                className="catchme-list-item"
              >
                <h3>{data.agency}</h3>
                <div className="details">
                  <span className="accent">
                    <GitPullRequest width="16" /> {data.routes}
                  </span>
                  <span className="primary">
                    <GitCommit width="16" /> {data.stops}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}

export default SelectPage
