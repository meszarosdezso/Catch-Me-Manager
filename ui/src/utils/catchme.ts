import { Stop, CatchMeData, Route, RoutesByColors } from "../interfaces"

export function parseData(data: {
  routes: { [key: string]: any }
  stops: { [key: string]: Stop }
  shapes: { [key: string]: any[] }
}): CatchMeData {
  if (!data) return {} as CatchMeData

  const ret: CatchMeData = {
    routes: {},
    stops: data.stops,
    shapes: {},
  } as CatchMeData

  for (const key in data.routes) {
    const rawRoute = data.routes[key]
    ret.routes[key] = {
      ...rawRoute,
      stops: rawRoute.stops.map((s: string) => data.stops[s]),
    }
  }

  for (const shapeId in data.shapes) {
    ret.shapes[shapeId] = data.shapes[shapeId].map((s) => ({
      sequence: s.sequence,
      coordinate: {
        latitude: s.lat,
        longitude: s.lng,
      },
    }))
  }

  return ret
}

export const groupRoutesByColors = (routes: {
  [id: string]: Route
}): RoutesByColors => {
  const colors: any = {}

  for (const routeId in routes) {
    if (routes[routeId].color !== "#1e1e1e")
      colors[routes[routeId].color] = [
        ...(colors[routes[routeId].color] || []),
        routeId,
      ]
  }

  return colors
}
