import { Box, Stack, Typography } from "@mui/material"
import { useStore } from "../state/state"
import logo from "../logo.svg"

export default function Header() {
  const date = useStore((s) => s.date)
  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Stack direction="row" sx={{ gap: 1 }} alignItems="center">
        <Box component="img" src={logo} sx={{ width: 40, height: 40 }} />
        <Typography component="h1" variant="h3">
          GoFuel
        </Typography>
        {date && (
          <Typography component="p" variant="subtitle1" sx={{ opacity: 0.75 }}>
            {date}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
