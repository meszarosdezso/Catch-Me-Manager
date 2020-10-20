export enum RouteType {
  Tramway,
  Subway,
  Rail,
  Bus,
  Ferry,
  CableCar,
  Gondola,
  Funicular,
  Coach,
  Air,
  Taxi,
}

export type Route = {
  agency_id: string
  short_name: string
  long_name: string
  id: string
  color?: string
  text_color?: string
  vehicle: RouteType
  stops: string[]
  shape_id?: string
}

export type Shape = {
  lat: number
  lng: number
  sequence: number
}

export type Stop = {
  name: string
  id: string
  lat?: number
  lng?: number
}

export type CatchMeData = {
  agencies: string[]
  stops: { [stopId: string]: Stop }
  routes: { [routeId: string]: Route }
  shapes: { [shapeId: string]: Shape[] }
}
