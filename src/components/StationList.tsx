import { useStore } from "../state/state"
import {
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material"

type Props = {}

const StationList = ({}: Props) => {
  const stations = useStore((state) => state.stations)
  const setSelectedStation = useStore((state) => state.setSelectedStation)
  const selectedStation = useStore((state) => state.selectedStation)

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container>
          <Grid size={12}>
            <Typography
              variant="overline"
              fontWeight="600"
              sx={{ opacity: 0.75 }}
            >
              Stations
            </Typography>
          </Grid>
          <Grid size={12}>
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
                          size="small"
                          label={`$${station.Price.Ulp91}`}
                        />
                      </ListItemIcon>
                      <ListItemText>
                        {station.TradingName} - {station.Location}
                      </ListItemText>
                    </ListItemButton>
                  </Tooltip>
                )
              })}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StationList
