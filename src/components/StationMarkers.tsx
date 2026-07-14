import React, { useEffect, useMemo, useRef } from "react"
import { useStore } from "../state/state"
import { GeoJSONSource, Map, MapMouseEvent } from "mapbox-gl"

type Props = {
  map: Map | null
}

export default function StationMarkers({ map }: Props) {
  const stations = useStore((state) => state.stations)
  const selectedStation = useStore((state) => state.selectedStation)
  const setSelectedStation = useStore((state) => state.setSelectedStation)
  const geoJsonSource = useRef<GeoJSONSource | undefined>(undefined)

  const onStationClick = (e: MapMouseEvent) => {
    if (!e.features) return

    const feature = e.features[0]
    if (!feature.properties) return

    const station = JSON.parse(feature.properties.data)
    setSelectedStation(station)
  }

  const geoJSON = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: stations
        .filter(
          (station) =>
            station.Address + `${station.Phone}` !==
            selectedStation?.Address + `${selectedStation?.Phone}`
        )
        .map((station) => ({
          type: "Feature" as const,
          properties: {
            id: station.Address,
            data: station,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [Number(station.Longitude), Number(station.Latitude)],
          },
        })),
    }
  }, [stations, selectedStation])

  useEffect(() => {
    if (map === null || stations.length === 0) return

    if (geoJsonSource.current === undefined) {
      // Create the source
      map.addSource("stations", {
        type: "geojson",
        data: geoJSON,
      })

      map.addLayer({
        id: "station-markers",
        type: "symbol",
        source: "stations",
        layout: {
          "icon-image": "disabled-pin",
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "icon-size": 0.1,
        },
        paint: {
          "icon-color": "#023f7a"
        }
      })
      geoJsonSource.current = map.getSource("stations")

      map.on("click", "station-markers", onStationClick)
      map.on("mouseenter", "station-markers", () => {
        map.getCanvas().style.cursor = "pointer"
      })
      map.on("mouseleave", "station-markers", () => {
        map.getCanvas().style.cursor = ""
      })
    } else {
      // Update the source
      geoJsonSource.current.setData(geoJSON)
    }
  }, [geoJSON, map])

  return <></>
}
