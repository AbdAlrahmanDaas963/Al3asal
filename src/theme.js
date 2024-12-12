// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1D3557",
    },
    secondary: {
      main: "#457B9D",
    },
  },
  typography: {
    allVariants: {
      color: "#fff",
    },
    kalam: {
      fontFamily: '"Kalam", cursive',
    },
    inter: {
      fontFamily: '"Inter", sans-serif',
    },
    katibeh: {
      fontFamily: '"Katibeh", serif',
    },
  },
});

export default theme;
