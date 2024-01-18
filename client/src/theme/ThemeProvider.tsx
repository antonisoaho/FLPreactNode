import { createContext, ReactNode, useContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('DARKMODE');
    return storedDarkMode ? JSON.parse(storedDarkMode) : false;
  });

  const toggleTheme = () => {
    setIsDarkMode((prevIsDarkMode: boolean) => {
      const newMode = !prevIsDarkMode;
      localStorage.setItem('DARKMODE', JSON.stringify(newMode));
      return newMode;
    });
  };

  const theme = createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// export const useStyles = makeStyles(() => {
//   return {
//     appBar: {
//       zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1,
//     },
//     userDrawer: {
//       zIndex: (theme: { zIndex: { appBar: number } }) => theme.zIndex.appBar + 1,
//     },
//   };
// });
