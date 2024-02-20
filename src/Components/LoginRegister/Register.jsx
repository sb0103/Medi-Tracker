import { TextField, Button, Box, Stack, Typography } from "@mui/material";
import "./login.css";
import { useHistory, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { register } from "../NetworkCalls/auth";

export default function Register({ setAlert, logged }) {
  const [regForm, setRegForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  let history = useHistory();

  const verifyRegisterForm = (form) => {
    let { username, password, email } = form;
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
          height: "28rem",
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
          <Typography>Register</Typography>
          <TextField
            sx={{ my: "0.3rem" }}
            fullWidth
            label="Username"
            name="username"
            value={regForm.username}
            onChange={(e) => {
              setRegForm((v) => {
                return {
                  ...v,
                  username: e.target.value,
                };
              });
            }}
          />
          <TextField
            sx={{ my: "0.3rem" }}
            fullWidth
            label="Email"
            name="email"
            value={regForm.email}
            onChange={(e) => {
              setRegForm((v) => {
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
            value={regForm.password}
            onChange={(e) => {
              setRegForm((v) => {
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
              if (verifyRegisterForm(regForm)) {
                let hasReg = await register(regForm, (message, severity) => {
                  setAlert({ isOpen: true, message, severity });
                });

                if (hasReg) {
                  history.push("/login");
                }
              }
            }}
          >
            Register
          </Button>

          <Stack>
            <Typography>Already have an account?</Typography>
            <Link to="/login" className="register-link">
              Login
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
