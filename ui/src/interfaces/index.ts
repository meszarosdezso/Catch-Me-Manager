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
  shape_id: string
}

export type Shape = {
  lat: number
  lng: number
  sequence: number
}

enum RouteType {
  Tramway,
  Subway,
  Rail,
  Bus,
  Ferry,
  CableCar,
  Gondola,
  Funicular,
}

export type CatchMeData = {
  stops: Stop[]
  routes: { [key: string]: Route }
  shapes: { [key: string]: Shape[] }
}
