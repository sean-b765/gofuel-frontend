import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Tooltip,
  Typography,
} from "@mui/material"
import "mapbox-gl/dist/mapbox-gl.css"
import { useStore } from "../state/state"
import React, { useCallback, useEffect, useRef, useState } from "react"
import mapboxGl, { Map as MapboxGLMap } from "mapbox-gl"
import UserLocationMarker from "./UserLocationMarker"
import SelectedStationMarker from "./SelectedStationMarker"
import disabledPin from "../assets/disabled-pin.png"
import StationMarkers from "./StationMarkers"
import { fetchJourney, fetchNearest } from "../api/api"
import { FetchNearestResponse } from "../types/dto"
import { Journey } from "../types/util"
import DriveEta from "../icons/DriveEta"
import Launch from "../icons/Launch"
import { debounce } from "lodash"

mapboxGl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const Map = () => {
  const [initialised, setInitialised] = useState(false)
  const mapRef = useRef<MapboxGLMap | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [journeyLoading, setJourneyLoading] = useState(false)
  const selectedStation = useStore((state) => state.selectedStation)
  const journey = useStore((state) => state.journey)
  const setJourney = useStore((state) => state.setJourney)
  const userLocation = useStore((state) => state.userLocation)
  const setStations = useStore((state) => state.setStations)
  const setDate = useStore((state) => state.setDate)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Initialise the map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return // initialized already, or no container available

    const map = new MapboxGLMap({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [115.86256114388702, -31.950664055777565],
      zoom: 12,
    })

    map.on("style.load", () => {
      mapRef.current = map

      // Register images
      mapRef.current.loadImage(disabledPin, (err, img) => {
        if (mapRef.current == null || err) return
        if (mapRef.current.hasImage("disabled-pin")) return
        mapRef.current.addImage("disabled-pin", img as ImageBitmap, { sdf: true })
      })

      setInitialised(true)
    })

    return () => {
      map.remove()
      mapRef.current = null
      setInitialised(false)
    }
  }, [])

  // Initialize the map center
  useEffect(() => {
    if (mapRef.current == null || userLocation === undefined) return

    mapRef.current.setCenter([userLocation.lng, userLocation.lat])
  }, [userLocation, initialised])

  const debouncedFetch = useCallback(
    debounce(() => {
      if (!mapRef.current) return

      const bounds = mapRef.current.getBounds()
      if (!bounds) return

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const topLeft = bounds.getNorthWest()
      const bottomRight = bounds.getSouthEast()

      fetchNearest(
        `${topLeft.lat},${topLeft.lng}`,
        `${bottomRight.lat},${bottomRight.lng}`,
        abortControllerRef.current.signal
      ).then((res: FetchNearestResponse | Error) => {
        if (res instanceof Error) return

        setStations(res.Stations || [])
        if (res.Date) setDate(res.Date)
      })
    }, 150),
    []
  )

  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const onMove = () => debouncedFetch()

    map.on("moveend", onMove)
    debouncedFetch()

    return () => {
      map.off("moveend", onMove)
      debouncedFetch.cancel()
    }
  }, [initialised, debouncedFetch])

  // Fetch the google directions journey when userLocation or selectedStation changes
  useEffect(() => {
    if (selectedStation === undefined || userLocation === undefined) return

    setJourneyLoading(true)
    fetchJourney(
      `${userLocation.lat},${userLocation.lng}`,
      `${selectedStation.Latitude},${selectedStation.Longitude}`
    )
      .then((journey) => {
        if (journey === undefined) return
        setJourney(journey as Journey)
      })
      .finally(() => {
        setJourneyLoading(false)
      })
  }, [selectedStation, userLocation])

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container>
          <Grid size={12}>
            <Typography
              variant="overline"
              fontWeight={600}
              sx={{ opacity: 0.75 }}
            >
              {selectedStation ? selectedStation.Title : "Map"}
            </Typography>
          </Grid>
          <Grid mt={2} size={12}>
            <Grid size={12} height={500} sx={{ position: "relative" }}>
              <div
                ref={mapContainerRef}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {initialised && (
                  <>
                    <UserLocationMarker map={mapRef.current} />
                    <SelectedStationMarker map={mapRef.current} />
                    <StationMarkers map={mapRef.current} />
                  </>
                )}
                {!initialised && (
                  <CircularProgress
                    variant="indeterminate"
                    size={30}
                    sx={{
                      position: "absolute",
                      left: "calc(50% - 15px)",
                      top: "calc(50% - 15px)",
                    }}
                  />
                )}
              </div>
            </Grid>
            {/* Price */}
            {selectedStation && (
              <Grid size={12} my={2}>
                <Grid>
                  <Chip
                    size="small"
                    label={`$${selectedStation.Price.Ulp91}`}
                  />
                </Grid>
              </Grid>
            )}
            {/* Details */}
            {selectedStation && (
              <Grid size={12} mb={2}>
                {selectedStation.Address && (
                  <Typography variant="body2">
                    {selectedStation.Address}
                  </Typography>
                )}
                {selectedStation.Location && (
                  <Typography variant="body1">
                    {selectedStation.Location}
                  </Typography>
                )}
                {selectedStation.Phone && (
                  <Typography variant="overline">
                    {selectedStation.Phone}
                  </Typography>
                )}
              </Grid>
            )}
            {journey?.Duration && journey?.Distance && !journeyLoading && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" display="flex">
                  <DriveEta
                    size={20}
                    sx={{ mr: 1, display: "flex", alignItems: "center" }}
                    color="#555"
                  />
                  <Tooltip title="Open directions in Google Maps">
                    <Link
                      href={`https://www.google.com/maps/dir/${userLocation?.lat},${userLocation?.lng}/${selectedStation?.Latitude},${selectedStation?.Longitude}`}
                      target="_blank"
                      color="textPrimary"
                      sx={{ textDecoration: "none" }}
                    >
                      {journey.Duration} | {journey.Distance}
                      <Launch
                        size={12}
                        sx={{ ml: 1, display: "inline" }}
                        color="white"
                      />
                    </Link>
                  </Tooltip>
                </Typography>
              </>
            )}
            {journeyLoading && (
              <>
                <Divider sx={{ my: 1 }} />
                <CircularProgress variant="indeterminate" size={20} />
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default React.memo(Map)
