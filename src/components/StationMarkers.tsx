import React, { useEffect, useMemo, useRef } from "react"
import { useStore } from "../state/state"
import { GeoJSONSource, Map, MapMouseEvent } from "mapbox-gl"
import { createPriceColor } from "../services/colour"

type Props = {
  map: Map | null
}

export default function StationMarkers({ map }: Props) {
  const stations = useStore((state) => state.stations)
  const selectedStation = useStore((state) => state.selectedStation)
  const setSelectedStation = useStore((state) => state.setSelectedStation)
  const geoJsonSource = useRef<GeoJSONSource | undefined>(undefined)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onStationClick = (e: MapMouseEvent) => {
    if (!e.features) return

    const feature = e.features[0]
    if (!feature.properties) return

    const station = JSON.parse(feature.properties.data)
    setSelectedStation(station)
  }

  const geoJSON = useMemo(() => {
    const priceColor = createPriceColor(
      stations.map((station) => Number(station.Price))
    )

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
            color: priceColor(Number(station.Price)),
          },
          geometry: {
            type: "Point" as const,
            coordinates: [Number(station.Longitude), Number(station.Latitude)],
          },
        })),
    }
  }, [stations, selectedStation])

  const geoJSONRef = useRef(geoJSON)
  geoJSONRef.current = geoJSON

  useEffect(() => {
    if (map === null || stations.length === 0) return
    if (geoJsonSource.current !== undefined) return

    map.addSource("stations", {
      type: "geojson",
      data: geoJSONRef.current,
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
        "icon-color": ["get", "color"],
      },
    })
    geoJsonSource.current = map.getSource("stations")

    const tooltip = document.createElement("div")
    tooltip.style.position = "absolute"
    tooltip.style.padding = "4px 8px"
    tooltip.style.background = "#ffffff"
    tooltip.style.color = "#222222"
    tooltip.style.borderRadius = "4px"
    tooltip.style.fontSize = "16px"
    tooltip.style.fontWeight = "600"
    tooltip.style.pointerEvents = "none"
    tooltip.style.whiteSpace = "nowrap"
    tooltip.style.transform = "translate(-50%, -100%)"
    tooltip.style.marginTop = "-8px"
    tooltip.style.zIndex = "10"
    tooltip.style.display = "none"
    map.getContainer().appendChild(tooltip)
    tooltipRef.current = tooltip

    const onEnter = (e: MapMouseEvent) => {
      map.getCanvas().style.cursor = "pointer"

      const features = map.queryRenderedFeatures(e.point, {
        layers: ["station-markers"],
      })
      if (!features?.[0]?.properties) return

      const station = JSON.parse(features[0].properties.data)

      timeoutRef.current = setTimeout(() => {
        tooltip.textContent = `$${station.Price}`
        tooltip.style.left = `${e.point.x}px`
        tooltip.style.top = `${e.point.y}px`
        tooltip.style.display = "block"
      }, 500)
    }
    const onLeave = () => {
      map.getCanvas().style.cursor = ""
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      tooltip.style.display = "none"
    }

    map.on("click", "station-markers", onStationClick)
    map.on("mouseenter", "station-markers", onEnter)
    map.on("mouseleave", "station-markers", onLeave)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      map.off("click", "station-markers", onStationClick)
      map.off("mouseenter", "station-markers", onEnter)
      map.off("mouseleave", "station-markers", onLeave)
      if (map.getLayer("station-markers")) map.removeLayer("station-markers")
      if (map.getSource("stations")) map.removeSource("stations")
      tooltip.remove()
      tooltipRef.current = null
      geoJsonSource.current = undefined
    }
  }, [map, stations.length])

  useEffect(() => {
    geoJsonSource.current?.setData(geoJSON)
  }, [geoJSON])

  return <></>
}
