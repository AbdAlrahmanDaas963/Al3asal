import { createTheme } from "@mui/material/styles";

const getTheme = (direction) =>
  createTheme({
    direction,
    palette: {
      mode: "dark",
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });

export default getTheme;
