import axios from 'axios'
import { fileToArrayBuffer } from './read'

export const sendFileOrUrl = async (
  fileOrUrl: string | File
): Promise<void> => {
  if (fileOrUrl instanceof File) {
    const arrayBuffer = await fileToArrayBuffer(fileOrUrl)

    if (arrayBuffer) {
      await axios.post('http://127.0.0.1:1873/gtfs', {
        gtfs: Buffer.from(arrayBuffer),
      })
    }
  } else if (typeof fileOrUrl === 'string') {
    await axios.post(`http://127.0.0.1:1873/gtfs?path=${fileOrUrl}`)
  }
}
