import { alpha, AppBar, Box, LinearProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { Main } from "@/components/Main";
import Header from "@/components/Header";
import Emitter from "@/services/eventemitter";
import { useStore } from "@/state/state";

const MAX_LOCATION_ATTEMPTS = 5;
const LOCATION_RETRY_DELAY = 5000;

export function meta(_: Route.MetaArgs) {
  return [
    { title: "GoFuel" },
    { name: "description", content: "Find the nearest fuel stations" },
  ];
}

export default function Home() {
  const [loading, setLoading] = useState(false);

  const userLocation = useStore((state) => state.userLocation);
  const setUserLocation = useStore((state) => state.setUserLocation);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const requestLocation = (attempt: number) => {
      console.log("attempt", attempt);
      if (cancelled || !navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;

          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          if (cancelled || attempt >= MAX_LOCATION_ATTEMPTS) return;

          retryTimer = setTimeout(
            () => requestLocation(attempt + 1),
            LOCATION_RETRY_DELAY
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    requestLocation(1);

    Emitter.on("AXIOS_START", () => {
      setLoading(true);
    });
    Emitter.on("AXIOS_STOP", () => {
      setLoading(false);
    });

    return () => {
      cancelled = true;
      if (retryTimer !== undefined) clearTimeout(retryTimer);
    };
  }, []);

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
  );
}