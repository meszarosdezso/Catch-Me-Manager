import React, { useRef, useState } from 'react'
import './UploadData.scss'
import { useCatchMe } from '../../providers/catchme.provider'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import LoadingPage from '../Loading/Loading'
import { Link } from 'react-router-dom'
import { Send } from 'react-feather'
import { sendFileOrUrl } from '../../utils/api'

const UploadPage: React.FC = () => {
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const urlRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const [state, setState] = useState<'LOADING' | 'READY'>('READY')

  const history = useHistory()
  const { uploadData } = useCatchMe()

  const handleSubmit = async (data: File | string) => {
    try {
      setState('LOADING')
      await sendFileOrUrl(data)
      handleDone()
    } catch (e) {
      console.log(e)
      setState('READY')
    }
  }

  const handleDone = async () => {
    const { data } = await axios.get(`/data.json`)
    uploadData(data)
    history.push('/')
  }

  if (state === 'LOADING')
    return <LoadingPage text="Processing your data ..." />

  return (
    <Layout showUpload={false}>
      <div className="UploadPage">
        <div>
          <h1>
            Let's start with some data
            <span aria-label="Box" role="img">
              {' '}
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
            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={e => handleSubmit(e.target.files![0])}
            />
            <h3 style={{ fontFamily: 'DM Mono, monospace' }}>/</h3>
            <div className="url-input">
              <label htmlFor="url">Insert URL</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  name="url"
                  ref={urlRef}
                  id="url"
                  placeholder="eg.: https://bkk.hu/gtfs/budapest_gtfs.zip"
                />
                <Send
                  id="sendUrlIcon"
                  style={{ marginLeft: '1rem' }}
                  onClick={_ => handleSubmit(urlRef.current.value)}
                />
              </div>
            </div>
          </div>
          <Link to="/select" id="already-have">
            I already have some data{' '}
            <span aria-label="Metal" role="img">
              🤘
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default UploadPage
