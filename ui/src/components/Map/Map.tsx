import React, { useMemo } from "react"
import "./Map.scss"
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
import { useCatchMe } from "../../providers/catchme.provider"

const Map: React.FC = () => {
  const MapBox = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoibWVzemFyb3NkZXpzbyIsImEiOiJjanA4MGk5djQwNzlyM3BvODEwYmxkMHBnIn0.Uv1FVlioisSft1sm3-GCRQ",
  })

  const { stops, shapes, routes } = useCatchMe()

  const { avgLat, avgLng } = useMemo(() => {
    const lats = stops.map((s) => s.lat)
    const lngs = stops.map((s) => s.lng)

    const avgLat = lats.reduce((a, b) => a + b) / lats.length
    const avgLng = lngs.reduce((a, b) => a + b) / lngs.length

    return { avgLat, avgLng }
  }, [stops])

  const groupRoutesByColors = useMemo(() => {
    const colors: any = {}

    for (const key in routes) {
      if (routes[key].color !== "#1e1e1e")
        colors[routes[key].color] = [...(colors[routes[key].color] || []), key]
    }

    return colors
  }, [])

  return (
    <div className="Map-container">
      <MapBox
        center={[avgLng, avgLat]}
        zoom={[11]}
        containerStyle={{
          width: "100%",
          height: "50vh",
          borderRadius: ".3rem",
          overflow: "hidden",
        }}
        style={"mapbox://styles/mapbox/light-v9" as string}
      >
        {Object.keys(groupRoutesByColors).map((color) => (
          <Layer
            key={color}
            type="line"
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
            paint={{
              "line-width": 2,
              "line-color": color,
            }}
          >
            {groupRoutesByColors[color].map((routeId: string) => (
              <Feature
                key={routeId}
                coordinates={shapes[routes[routeId].shape_id].map((point) => [
                  point.lng,
                  point.lat,
                ])}
              />
            ))}
          </Layer>
        ))}
      </MapBox>
    </div>
  )
}

export default Map
