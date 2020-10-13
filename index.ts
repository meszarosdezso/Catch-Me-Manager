import { fromGtfs } from './pkg/catchme_creator.js'

const path = Deno.args[0]

if (!path) {
  console.error('Missing argument: [path]')
  Deno.exit(1)
}

gtfsToCatchme(path)

async function gtfsToCatchme(gtfsPath: string) {
  const zip = await fetchZip(gtfsPath)

  const catchmeData = fromGtfs(zip)

  await Deno.writeTextFile('export.json', catchmeData)

  console.log('GTFS successfully exported.')
}

async function fetchZip(path: string): Promise<Uint8Array> {
  if (path.startsWith('http')) {
    const res = await fetch(path)
    const data = await res.blob()
    return new Uint8Array(await data.arrayBuffer())
  } else {
    return await Deno.readFile(`${Deno.cwd()}/${path}`)
  }
}
