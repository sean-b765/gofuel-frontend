import { useStore } from "../state/state"
import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material"

type Props = {}

const StationList = ({}: Props) => {
  const stations = useStore((state) =>
    state.stations.sort((a, b) => a.Price.Ulp91 - b.Price.Ulp91),
  )
  const setSelectedStation = useStore((state) => state.setSelectedStation)
  const selectedStation = useStore((state) => state.selectedStation)

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Typography variant="subtitle1" fontWeight="600">
          ⛽️ GoFuel
        </Typography>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <List>
            {stations.map((station, key) => {
              return (
                <Tooltip
                  key={key}
                  followCursor
                  title={`${station.Address} | ${station.Phone}`}
                >
                  <ListItemButton
                    selected={station === selectedStation}
                    onClick={() =>
                      station === selectedStation
                        ? setSelectedStation(undefined)
                        : setSelectedStation(station)
                    }
                  >
                    <ListItemIcon>
                      <Chip
                        style={{ marginRight: "0.5rem" }}
                        size="small"
                        label={`$${station.Price.Ulp91}`}
                      />
                    </ListItemIcon>
                    <ListItemText>{station.Title}</ListItemText>
                  </ListItemButton>
                </Tooltip>
              )
            })}
          </List>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StationList
