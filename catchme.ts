import * as catchme from './pkg/catchme_creator.js'
import type { CatchMeData } from './types.d.ts'

type GTFStoCatchme = (
  gtfs: string | Uint8Array,
  options?: { writeFile?: boolean }
) => Promise<CatchMeData | void>

export const gtfsToCatchme: GTFStoCatchme = async (gtfs, options) => {
  const zip = typeof gtfs === 'string' ? await _fetchZip(gtfs) : gtfs

  const catchmeData = catchme.fromGtfs(zip)

  if (options?.writeFile) {
    await Deno.writeTextFile(`${Deno.cwd()}/ui/public/export.json`, catchmeData)
  } else {
    return JSON.parse(catchmeData) as CatchMeData
  }
}

async function _fetchZip(path: string): Promise<Uint8Array> {
  if (path.startsWith('http')) {
    const res = await fetch(path)
    const data = await res.blob()
    return new Uint8Array(await data.arrayBuffer())
  } else {
    return await Deno.readFile(`${Deno.cwd()}/${path}`)
  }
}
