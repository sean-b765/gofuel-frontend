import React, { useRef } from "react"
import { useStore } from "../state/state"
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Slider,
  Typography,
} from "@mui/material"

const SHOW_ALL_RADIUS = 9999

type Props = {}

export const Controls = ({}: Props) => {
  const searchRadius = useStore((state) => state.searchRadius)
  const setSearchRadius = useStore((state) => state.setSearchRadius)
  const previousRadius = useRef(searchRadius)

  const showAll = searchRadius === SHOW_ALL_RADIUS

  const toggleShowAll = (checked: boolean) => {
    if (checked) {
      previousRadius.current = searchRadius
      setSearchRadius(SHOW_ALL_RADIUS)
      return
    }
    setSearchRadius(previousRadius.current)
  }

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
              Controls
            </Typography>
          </Grid>
          <Grid size={12}>
            <Grid container columns={12}>
              <Typography>Search Radius (km)</Typography>
              <Slider
                size="small"
                aria-label="Small"
                valueLabelDisplay="auto"
                value={searchRadius}
                disabled={showAll}
                onChange={(e, value) => setSearchRadius(value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showAll}
                    onChange={(e) => toggleShowAll(e.target.checked)}
                  />
                }
                label="Show all"
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
