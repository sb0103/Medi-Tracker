import { TextField, Button, Box, Stack, Typography } from "@mui/material";
import "./login.css";
import { useHistory, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { login } from "../NetworkCalls/auth";

export default function Login({ setAlert, logged, setLogged, setUserDetails }) {
  const [loginForm, setLoginForm] = useState({
    password: "",
    email: "",
  });

  let history = useHistory();

  useEffect(() => {
    if (logged.isLogged === true) {
      history.push("/app");
      setAlert({
        isOpen: true,
        message:
          "Already Logged In, Logout to LoginRegister with another email and password",
        severity: "info",
      });
    }
  }, []);

  const verifyLoginForm = (form) => {
    let { password, email } = form;
    if (!email.match(new RegExp("[@]")) || !email.match(new RegExp("[.]"))) {
      setAlert({
        isOpen: true,
        message: "Invalid Email ID",
        severity: "error",
      });
      return false;
    }

    if (
      !password.match(new RegExp("[a-zA-Z]{12}")) ||
      !password.match(new RegExp("[0-9]{1}"))
    ) {
      setAlert({
        isOpen: true,
        message:
          "Password must contain atleast 12 alphabet and atleast 1 numeric",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  return (
    <Box
      className="bg-img"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "95vh",
      }}
    >
      <Box
        sx={{
          width: "22rem",
          height: "23rem",
          backgroundColor: "#eef2f3",
          p: "2rem",
          borderRadius: "6px",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            justifiedContent: "center",
            rowGap: "0.5rem",
          }}
        >
          <Typography>Login</Typography>
          <TextField
            sx={{ my: "0.3rem" }}
            fullWidth
            label="Email"
            name="email"
            value={loginForm.email}
            onChange={(e) => {
              setLoginForm((v) => {
                return {
                  ...v,
                  email: e.target.value,
                };
              });
            }}
          />
          <TextField
            sx={{ my: "0.3rem" }}
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={loginForm.password}
            onChange={(e) => {
              setLoginForm((v) => {
                return {
                  ...v,
                  password: e.target.value,
                };
              });
            }}
          />
          <Button
            sx={{ my: "1rem", color: "white" }}
            fullWidth
            variant="contained"
            onClick={async () => {
              if (verifyLoginForm(loginForm)) {
                let data = await login(loginForm, (message, severity) => {
                  setAlert({ isOpen: true, message, severity });
                });

                if (data) {
                  let { username, email, token } = data;

                  setUserDetails({ username, email });
                  setLogged({ isLogged: true, token: token });

                  history.push("/app");
                }
              }
            }}
          >
            Login
          </Button>
          <Stack sx={{ fontSize: "0.5rem" }}>
            <Typography>Don't have an account?</Typography>
            <Link to="/" className="login-link">
              Register
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
