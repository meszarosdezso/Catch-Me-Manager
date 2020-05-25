import { Stop, CatchMeData, Shape } from "../interfaces"

export function parseData(data: {
  routes: { [key: string]: any }
  stops: { [key: string]: Stop }
  shapes: { [key: string]: Shape[] }
}): CatchMeData {
  if (!data) return {} as CatchMeData

  const ret: CatchMeData = { routes: {}, stops: [], shapes: {} } as CatchMeData

  for (const key in data.routes) {
    const rawRoute = data.routes[key]
    ret.routes[key] = {
      ...rawRoute,
      stops: rawRoute.stops.map((s: string) => data.stops[s]),
    }
  }

  ret.shapes = data.shapes

  ret.stops = Object.values(data.stops)

  return ret
}
