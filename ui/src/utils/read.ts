export const fileToArrayBuffer = (
  file: File | Blob
): Promise<string | ArrayBuffer | null> => {
  const fileReader = new FileReader()

  fileReader.readAsArrayBuffer(file)

  return new Promise((res, rej) => {
    fileReader.onload = ({ target }) => {
      res(target?.result)
    }
    fileReader.onerror = rej
  })
}
