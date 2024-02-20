import "./App.css";
import NavBar from "./Components/NavBar/NavBar";
import * as React from "react";
import SimpleAlert from "./Components/Alert/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, Switch, BrowserRouter } from "react-router-dom";

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
              />
            </Route>
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
