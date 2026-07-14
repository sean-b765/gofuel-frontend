import "./App.css"
import {
  alpha,
  AppBar,
  Box,
  CssBaseline,
  LinearProgress,
  Stack,
} from "@mui/material"
import { Main } from "./components/Main"
import Header from "./components/Header"
import AppTheme from "./theme/AppTheme"
import { useCallback, useEffect, useState } from "react"
import Emitter from "./services/eventemitter"
import { fetchNearest } from "./api/api"
import { FetchNearestResponse } from "./types/dto"
import { debounce } from "lodash"
import { useStore } from "./state/state"

function App() {
  const [loading, setLoading] = useState(false)

  const setStations = useStore((state) => state.setStations)
  const searchRadius = useStore((state) => state.searchRadius)
  const userLocation = useStore((state) => state.userLocation)
  const setUserLocation = useStore((state) => state.setUserLocation)
  const setDate = useStore((state) => state.setDate)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        undefined,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }

    Emitter.on("AXIOS_START", () => {
      setLoading((state) => true)
    })
    Emitter.on("AXIOS_STOP", () => {
      setLoading((state) => false)
    })
  }, [])

  const debouncedFetch = useCallback(
    debounce((lat: number, lng: number, rad: number) => {
      if (!lat || !lng) return

      fetchNearest(`${lat},${lng}`, rad).then(
        (res: FetchNearestResponse | Error) => {
          if (res instanceof Error) return

          setStations(res.Stations || [])
          if (res.Date) setDate(res.Date)
        }
      )
    }, 750),
    []
  )

  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng)
      debouncedFetch(userLocation.lat, userLocation.lng, searchRadius)

    return () => {
      debouncedFetch.cancel()
    }
  }, [userLocation, searchRadius])

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Main />
          </Stack>
        </Box>

        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
          {loading && <LinearProgress variant="indeterminate" />}
        </AppBar>
      </Box>
    </AppTheme>
  )
}

export default App
