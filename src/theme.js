import { createTheme } from "@mui/material/styles";

const getTheme = (direction) =>
  createTheme({
    direction,
    palette: {
      mode: "dark",
      primary: {
        main: "#E4272B",
      },
      secondary: {
        main: "#121212",
      },
      grey: {
        main: "#292929",
      },
      black: {
        main: "#121212",
      },
      red: {
        main: "#E4272B",
      },
    },
    typography: {
      fontFamily: "Cairo, Roboto, Arial, sans-serif",
      htmlFontSize: 16,
      button: {
        fontFamily: "Cairo, Roboto, Arial, sans-serif",
        textTransform: "none", // Optional: to avoid uppercase transformation
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginInlineStart: "8px",
          marginInlineEnd: "8px",
          minWidth: "unset", // Prevents button width issues in RTL
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
        },
      },
    },
    MuiStack: {
      defaultProps: {
        direction: "row", // Let MUI handle RTL conversion automatically
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          html: {
            width: "100%",
            height: "100%",
            WebkitTextSizeAdjust: "100%",
          },
          body: {
            width: "100%",
            height: "100%",
            WebkitTextSizeAdjust: "100%",
            // Add these for RTL support
            direction: theme.direction,
            fontFamily: theme.typography.fontFamily,
          },
        }),
      },
    },
  });

export default getTheme;
