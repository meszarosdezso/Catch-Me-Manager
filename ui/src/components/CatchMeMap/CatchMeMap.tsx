import React, { useMemo } from 'react'
import './CatchMeMap.scss'
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'
import { useCatchMe } from '../../providers/catchme.provider'
import { VisibleRoutesConsumer } from '../../providers/visibleRoutes.provider'

type Props = {
  style?: React.CSSProperties
  id?: string
}

const CatchMeMap: React.FC<Props> = ({ style, id }) => {
  const MapBox = ReactMapboxGl({
    accessToken:
      'pk.eyJ1IjoibWVzemFyb3NkZXpzbyIsImEiOiJjanA4MGk5djQwNzlyM3BvODEwYmxkMHBnIn0.Uv1FVlioisSft1sm3-GCRQ',
  })

  const { stops, routes, shapes } = useCatchMe()

  const { avgLat, avgLng } = useMemo(() => {
    const lats = Object.values(stops).map(s => s.lat)
    const lngs = Object.values(stops).map(s => s.lng)

    const avgLat = lats.reduce((a, b) => a + b) / lats.length
    const avgLng = lngs.reduce((a, b) => a + b) / lngs.length

    return { avgLat, avgLng }
  }, [stops])

  return (
    <div id={id} style={{ ...style }} className="Map-container">
      <MapBox
        center={[avgLng, avgLat]}
        zoom={[11]}
        containerStyle={{
          width: '100%',
          height: '100%',
          borderRadius: '.3rem',
          overflow: 'hidden',
        }}
        style={'mapbox://styles/mapbox/dark-v9' as string}
      >
        <VisibleRoutesConsumer>
          {({ visibleRoutes, selectedRoute, selectedStop }) => {
            return (
              <div className="MapLayers">
                {Object.keys(visibleRoutes).map(color => (
                  <Layer
                    key={color}
                    type="line"
                    layout={{
                      'line-cap': 'round',
                      'line-join': 'round',
                    }}
                    paint={{
                      'line-width': 2,
                      'line-color': color,
                    }}
                  >
                    {visibleRoutes[color].map(routeId => {
                      const shape = shapes[routes[routeId].shape_id]

                      if (!shape) {
                        return <Feature key={routeId} coordinates={[0, 0]} />
                      }

                      return (
                        <Feature
                          key={routeId}
                          coordinates={shape.map(
                            ({ coordinate: { latitude, longitude } }) => [
                              longitude,
                              latitude,
                            ]
                          )}
                        />
                      )
                    })}
                  </Layer>
                ))}

                {selectedRoute.stops &&
                  selectedRoute.stops.map(s => (
                    <Marker key={s.id} coordinates={[s.lng, s.lat]}>
                      <div
                        className="stop-marker"
                        data-stop-name={s.name}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          backgroundColor:
                            selectedRoute.color +
                            (selectedStop.id === s.id ? 'ff' : '55'),
                          borderRadius: '50%',
                          transform: `translate(0%, 50%)`,
                        }}
                      ></div>
                    </Marker>
                  ))}
              </div>
            )
          }}
        </VisibleRoutesConsumer>
      </MapBox>
    </div>
  )
}

export default CatchMeMap
