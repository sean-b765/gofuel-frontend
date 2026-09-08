import { alpha, Box } from "@mui/material"
import { useEffect } from "react"
import type { Route } from "./+types/home"
import { Main } from "@/components/Main"
import { useStore } from "@/state/state"

const MAX_LOCATION_ATTEMPTS = 5
const LOCATION_RETRY_DELAY = 5000

export function meta(_: Route.MetaArgs) {
  return [
    { title: "GoFuel" },
    { name: "description", content: "Find the nearest fuel stations" },
  ]
}

export default function Home() {
  const userLocation = useStore((state) => state.userLocation)
  const setUserLocation = useStore((state) => state.setUserLocation)

  useEffect(() => {
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined

    const requestLocation = (attempt: number) => {
      console.log("attempt", attempt)
      if (cancelled || !navigator.geolocation) return

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return

          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {
          if (cancelled || attempt >= MAX_LOCATION_ATTEMPTS) return

          retryTimer = setTimeout(
            () => requestLocation(attempt + 1),
            LOCATION_RETRY_DELAY,
          )
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    }

    requestLocation(1)

    return () => {
      cancelled = true
      if (retryTimer !== undefined) clearTimeout(retryTimer)
    }
  }, [])

  return (
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
        <Main />
      </Box>
    </Box>
  )
}
