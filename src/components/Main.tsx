import { Box } from "@mui/material"
import StationList from "./StationList"
import Map from "./Map"

export const Main = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        "@supports (height: 100dvh)": {
          height: "100dvh",
        },
        overflow: "hidden",
      }}
    >
      <Map />
      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          top: { xs: "auto", md: 0 },
          left: { xs: 0, md: 0 },
          right: { xs: 0, md: "auto" },
          bottom: 0,
          width: { xs: "100%", md: 320 },
          height: { xs: "40vh", md: "auto" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StationList />
      </Box>
    </Box>
  )
}
