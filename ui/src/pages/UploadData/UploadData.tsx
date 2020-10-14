import React, { useRef, useState } from 'react'
import './UploadData.scss'
import { useCatchMe } from '../../providers/catchme.provider'
import Layout from '../../components/Layout/Layout'
import { fileToArrayBuffer } from '../../utils/read'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import LoadingPage from '../Loading/Loading'

const UploadPage: React.FC = () => {
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const [state, setState] = useState<'LOADING' | 'READY'>('READY')

  const history = useHistory()
  const { uploadData } = useCatchMe()

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setState('LOADING')
    try {
      const file = e.target.files![0]

      const arrayBuffer = await fileToArrayBuffer(file)

      if (arrayBuffer) {
        await axios.post('http://127.0.0.1:1873/gtfs', {
          gtfs: Buffer.from(arrayBuffer),
        })

        const { data } = await axios.get('/export.json')

        uploadData(data)
      }

      history.push('/')
    } catch (e) {
      console.log(e.response)
      setState('READY')
    }
  }

  if (state === 'LOADING')
    return <LoadingPage text="Processing your data ..." />

  return (
    <Layout showUpload={false}>
      <div className="UploadPage">
        <div>
          <h1>
            Let's start with some data{' '}
            <span aria-label="Down finger" role="img">
              🗂
            </span>
          </h1>
          <div className="get-started">
            <button
              id="file-upload"
              onClick={_ => fileRef.current.click()}
              className="full"
            >
              Upload GTFS zip
            </button>
            <input type="file" hidden ref={fileRef} onChange={uploadFile} />
            <h3 style={{ fontFamily: 'DM Mono, monospace' }}>/</h3>
            <div className="url-input">
              <label htmlFor="url">Insert URL</label>
              <br />
              <input
                type="text"
                name="url"
                id="url"
                placeholder="eg.: https://bkk.hu/gtfs/budapest_gtfs.zip"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UploadPage
