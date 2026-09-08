import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { colorSchemes, typography, shadows, shape } from "./themePrimitives"

interface AppThemeProps {
  children: ReactNode
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean
  themeComponents?: ThemeOptions["components"]
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props
  const theme = useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          colorSchemes: { light: colorSchemes.light }, // Force light mode only, see https://mui.com/material-ui/customization/palette/#color-schemes
          typography,
          shadows,
          shape,
          components: {
            ...themeComponents,
          },
        })
  }, [disableCustomTheme, themeComponents])
  if (disableCustomTheme) {
    return <>
      {children}
    </>
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
