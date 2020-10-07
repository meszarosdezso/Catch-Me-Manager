import {
  Stop,
  CatchMeData,
  Route,
  RoutesByColors,
  RouteType,
} from '../interfaces'

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

  Object.keys(data.routes).forEach(key => {
    const rawRoute = data.routes[key]
    ret.routes[key] = {
      ...rawRoute,
      type: parseRouteType(rawRoute.vehicle),
      stops: rawRoute.stops.map((s: string) => data.stops[s]),
    }
  })

  for (const shapeId in data.shapes) {
    ret.shapes[shapeId] = data.shapes[shapeId].map(s => ({
      sequence: s.sequence,
      coordinate: {
        latitude: s.lat,
        longitude: s.lng,
      },
    }))
  }

  return ret
}

const parseRouteType = (typeNum: number): RouteType => {
  switch (typeNum) {
    case 0:
      return RouteType.Tramway
    case 1:
      return RouteType.Subway
    case 3:
      return RouteType.Bus
    case 4:
      return RouteType.Ferry
    case 11:
      return RouteType.Trolleybus
    case 800:
      return RouteType.Trolleybus
    case 109:
      return RouteType.Rail
    default:
      return RouteType.Bus
  }
}

export const groupRoutesByColors = (routes: {
  [id: string]: Route
}): RoutesByColors => {
  const colors: any = {}

  for (const routeId in routes) {
    if (routes[routeId].color !== '#1e1e1e')
      colors[routes[routeId].color] = [
        ...(colors[routes[routeId].color] || []),
        routeId,
      ]
  }

  return colors
}
