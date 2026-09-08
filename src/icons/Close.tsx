import { Box, SxProps } from "@mui/material"
import React from "react"

type Props = {
  size: number
  sx?: SxProps
  color?: string
}

export default function Close({ size, sx, color }: Props) {
  return (
    <Box sx={sx} color={color}>
      <svg
        height={size}
        width={size}
        className="svg-icon css-5zsjn4"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        tabIndex={-1}
        fill="currentColor"
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </Box>
  )
}
