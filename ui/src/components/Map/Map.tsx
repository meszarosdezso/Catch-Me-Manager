import React, { useMemo } from "react"
import "./Map.scss"
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
import { useCatchMe } from "../../providers/catchme.provider"

const Map: React.FC = () => {
  const MapBox = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoibWVzemFyb3NkZXpzbyIsImEiOiJjanA4MGk5djQwNzlyM3BvODEwYmxkMHBnIn0.Uv1FVlioisSft1sm3-GCRQ",
  })

  const { stops, shapes, routes, routesByColors } = useCatchMe()

  const { avgLat, avgLng } = useMemo(() => {
    const lats = Object.values(stops).map((s) => s.lat)
    const lngs = Object.values(stops).map((s) => s.lng)

    const avgLat = lats.reduce((a, b) => a + b) / lats.length
    const avgLng = lngs.reduce((a, b) => a + b) / lngs.length

    return { avgLat, avgLng }
  }, [stops])

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
        {Object.keys(routesByColors).map((color) => (
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
            {routesByColors[color].map((routeId: string) => (
              <Feature
                key={routeId}
                coordinates={shapes[
                  routes[routeId].shape_id
                ].map(({ coordinate: { latitude, longitude } }) => [
                  longitude,
                  latitude,
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
