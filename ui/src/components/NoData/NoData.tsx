import React, { useRef } from "react"
import "./NoData.scss"
import { useCatchMe } from "../../providers/catchme.provider"

const NoData: React.FC = () => {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const { uploadData } = useCatchMe()

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const jsonData = await parseJsonFile(file)
    uploadData(jsonData)
  }

  const parseJsonFile = (file: File) =>
    new Promise((res, rej) => {
      const fileReader = new FileReader()
      fileReader.readAsText(file)
      fileReader.onload = (event) => {
        res(JSON.parse(event.target?.result as string))
      }
      fileReader.onerror = rej
    })

  return (
    <div className="NoData">
      <h1>
        Upload some data{" "}
        <span aria-label="Down finger" role="img">
          👇
        </span>
      </h1>
      <p className="get-started">
        To get started run <code>catchme-manager /path/to/gtfs/directory</code>
        or{" "}
        <button onClick={(_) => inputRef.current.click()} className="full">
          Upload JSON
        </button>
        <input type="file" hidden ref={inputRef} onChange={uploadFile} />
      </p>
    </div>
  )
}

export default NoData
