import { createTheme } from '@mui/material/styles';

/**
 * Tema personalizado de Material-UI con colores de Fundación Carmen Gaudié
 * Colores principales: Turquesa (#4DB6AC), Coral (#E57373), Naranja (#FFB74D)
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#4DB6AC', // Turquoise
      light: '#80CBC4', // Turquoise light
      dark: '#00897B',
      contrastText: '#fff',
    },
    secondary: {
      main: '#E57373', // Coral
      light: '#EF9A9A',
      dark: '#D84315', // Coral dark
      contrastText: '#fff',
    },
    error: {
      main: '#D84315', // Coral dark para errores
      light: '#E57373',
      dark: '#BF360C',
    },
    warning: {
      main: '#FFB74D', // Orange
      light: '#FFE082',
      dark: '#F57C00',
    },
    info: {
      main: '#4DB6AC', // Turquoise para info
      light: '#80CBC4',
      dark: '#00897B',
    },
    success: {
      main: '#4DB6AC', // Turquoise para success
      light: '#80CBC4',
      dark: '#00897B',
    },
  },
  typography: {
    fontFamily: "'Assistant', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Assistant', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Assistant', sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Assistant', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Assistant', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Assistant', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Assistant', sans-serif",
      fontWeight: 600,
    },
    button: {
      fontFamily: "'Assistant', sans-serif",
      fontWeight: 600,
      textTransform: 'none', // Sin mayúsculas automáticas
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(77, 182, 172, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4DB6AC',
            },
          },
        },
      },
    },
  },
});
