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
  text_color: string
  stops: Stop[]
}

enum RouteType {}

export type CatchMeData = {
  stops: Stop[]
  routes: { [key: string]: Route }
}
