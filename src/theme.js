import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'
import '@fontsource/cairo'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#4200FF' ,
    },
    secondary: {
      main: '#000022',
      light: '#7B7B98',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Cairo',
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '37.48px',
  },
})

export default theme
