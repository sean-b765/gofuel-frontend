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
        overflow: "hidden",
      }}
    >
      <Map />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 320,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StationList />
      </Box>
    </Box>
  )
}
