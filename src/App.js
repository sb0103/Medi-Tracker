import "./App.css";
import MainTabs from "./Components/MainTabs/MainTabs";
import NavBar from "./Components/NavBar/NavBar";
import HomePage from "./Components/HomePage/HomePage";

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { lime, purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7bd3ff",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#ffb46d",
      light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#47008F",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <NavBar userName={"Elegant Swan"} avatarSrc={""} />
        <MainTabs />
        {/* <HomePage /> */}
      </ThemeProvider>
    </>
  );
}

export default App;
