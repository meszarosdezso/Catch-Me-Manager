import { Stop, CatchMeData } from "../interfaces"

export function parseData({
  routes,
  stops,
}: {
  routes: { [key: string]: any }
  stops: { [key: string]: Stop }
}): CatchMeData {
  const ret: CatchMeData = {}

  for (const key in routes) {
    const rawRoute = routes[key]
    ret[key] = {
      ...rawRoute,
      stops: rawRoute.stops.map((s: string) => stops[s]),
    }
  }

  return ret
}
