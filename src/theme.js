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
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            width: "100%",
            height: "100%",
            WebkitTextSizeAdjust: "100%",
          },
          body: {
            width: "100%",
            height: "100%",
            WebkitTextSizeAdjust: "100%",
          },
        },
      },
    },
  });

export default getTheme;
