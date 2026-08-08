import { Box, Grid } from "@mui/material"
import StationList from "./StationList"
import Map from "./Map"
import { useStore } from "../state/state"

type Props = {}

export const Main = ({}: Props) => {
  const selectedStation = useStore((state) => state.selectedStation)

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={2} columns={12}>
        <Grid size={12}>
          <Map />
        </Grid>

        <Grid size={12}>
          <StationList />
        </Grid>
      </Grid>
    </Box>
  )
}
