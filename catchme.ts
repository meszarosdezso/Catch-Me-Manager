import * as CatchMe from './pkg/catchme_creator.js'
import type { CatchMeData } from './types.d.ts'

export const fetchAllExported = async () => {
  const dir = Deno.readDir(`${Deno.cwd()}/exports`)
  const data = []

  for await (const thing of dir) {
    if (thing.isFile) {
      const catchMeData = JSON.parse(
        await Deno.readTextFile(`${Deno.cwd()}/exports/${thing.name}`)
      ) as CatchMeData

      data.push({
        agencies: catchMeData.agencies,
        routes: Object.keys(catchMeData.routes).length,
        stops: Object.keys(catchMeData.stops).length,
        fileName: thing.name,
      })
    }
  }

  return data
}

export const fetchExported = async (fileName: string): Promise<CatchMeData> => {
  const data = JSON.parse(
    await Deno.readTextFile(`${Deno.cwd()}/exports/${fileName}`)
  )

  return data as CatchMeData
}

type GTFStoCatchme = (
  gtfs: string | Uint8Array,
  options?: { writeFile?: boolean }
) => Promise<CatchMeData>

export const gtfsToCatchme: GTFStoCatchme = async (gtfs, options) => {
  const zip = typeof gtfs === 'string' ? await _fetchZip(gtfs) : gtfs

  const catchmeString = CatchMe.fromGtfs(zip)

  const data = JSON.parse(catchmeString) as CatchMeData

  if (options?.writeFile) {
    await Deno.writeTextFile(`${Deno.cwd()}/ui/public/data.json`, catchmeString)

    await Deno.writeTextFile(
      `${Deno.cwd()}/exports/${data.agencies[0]}.json`,
      catchmeString
    )
  }

  return data
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
