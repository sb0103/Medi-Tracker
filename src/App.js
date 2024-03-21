import "./App.css";
import NavBar from "./Components/NavBar/NavBar";
import * as React from "react";
import SimpleAlert from "./Components/Alert/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, Switch, BrowserRouter, useHistory } from "react-router-dom";
import { useEffect } from "react";

import Login from "./Components/LoginRegister/Login";
import Register from "./Components/LoginRegister/Register";
import MainTabs from "./Components/MainTabs/MainTabs";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      //  will be calculated from palette.primary.main,
      dark: "#1565c0",
      // will be calculated from palette.primary.main,
      contrastText: "#ffffff",

      // will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#ffb46d",
      light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffffff",
    },
    red: {
      main: "#c01515",
    },
    white: {
      main: "#ffffff  ",
    },
    table: {
      dark: "#e1e1e1",
      light: "#ffffff",
    },
  },
});

const theme2 = createTheme({
  palette: {
    primary: {
      main: "#eabfef",
      light: "#f7e5f8",
      //  will be calculated from palette.primary.main,
      dark: "#cc67d9",
      // will be calculated from palette.primary.main,
      contrastText: "#ffffff",

      // will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#9d68f2",
      light: "#d6c0f8",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffffff",
    },
    red: {
      main: "#c01515",
    },
    white: {
      main: "#ffffff  ",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#e268f2",
      light: "#eb97f6",
      //  will be calculated from palette.primary.main,
      dark: "#cd00e4",
      // will be calculated from palette.primary.main,
      contrastText: "#ffffff",

      // will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#9d68f2",
      light: "#d6c0f8",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffffff",
    },
    red: {
      main: "#c01515",
    },
    white: {
      main: "#ffffff  ",
    },
  },
});

function App() {
  const [alert, setAlert] = React.useState({
    isOpen: false,
    message: "",
    severity: "error",
  });

  const [logged, setLogged] = React.useState({ isLogged: false, token: "" });
  const [userDetails, setUserDetails] = React.useState({
    email: "",
    username: "",
  });

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NavBar
            logged={logged}
            setLogged={setLogged}
            userDetails={userDetails}
            userName={"Elegant Swan"}
            avatarSrc={""}
          />
          <SimpleAlert
            isOpen={alert.isOpen}
            setOpen={(b) => {
              setAlert((ov) => {
                return { ...ov, isOpen: b };
              });
            }}
            message={alert.message}
            severity={alert.severity}
          />
          <Switch>
            <Route path="/login">
              <Login
                alert={alert}
                setAlert={setAlert}
                logged={logged}
                setLogged={setLogged}
                setUserDetails={setUserDetails}
              />
            </Route>
            <Route path="/app">
              <MainTabs
                alert={alert}
                setAlert={setAlert}
                logged={logged}
                setLogged={setLogged}
              />
            </Route>

            <Route exact path="/">
              <Register
                alert={alert}
                setAlert={setAlert}
                logged={logged}
                setLogged={setLogged}
                setUserDetails={setUserDetails}
              />
            </Route>
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
