export type Stop = {
  name: string
  id: string
  lat: number
  lng: number
}

export type Route = {
  id: string
  name: string
  color: string
  type: RouteType
  stops: Stop[]
}

enum RouteType {}

export type CatchMeData = { [key: string]: Route }
