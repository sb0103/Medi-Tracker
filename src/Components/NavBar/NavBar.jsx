import { useEffect, useState } from "react";
import "./navBar.css";
import { Button, Avatar, Typography, Box } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function NavBar({
  userName,
  avatarSrc,
  logged,
  userDetails,
  setLogged,
}) {
  let [isMobile, setIsMobile] = useState(false);
  let history = useHistory();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.screen.availWidth <= 500);
    });
  }, []);

  if (!isMobile) {
    return (
      <>
        {/* Changed to use the MUI colors and components */}
        <Box sx={{ backgroundColor: "primary.main" }} className="nav-bar">
          <Box
            backgroundColor="#1565c0"
            sx={{ height: "4rem", borderRadius: "8px" }}
            className="nav-bar-logo"
          >
            <img className="logo-img" src="./logo.png" alt="" />
            Medi-Tracker
          </Box>
          <Box className="nav-bar-leftGroup">
            <Avatar
              sx={{ bgcolor: "#eeeeee" }}
              alt={userDetails.username}
              src={avatarSrc}
            />

            {logged.isLogged ? (
              <Typography color={"white.main"}>
                {userDetails.username}
              </Typography>
            ) : (
              <></>
            )}
            <Button
              sx={{
                fontSize: "1rem",
                textWrap: "false",
                width: "7rem",
              }}
              color="white"
              onClick={() => {
                if (logged.isLogged) {
                  setLogged({ isLogged: false, token: "" });
                  localStorage.removeItem("loginData");
                  window.setTimeout(() => {
                    history.push("/login");
                  }, 350);
                } else {
                  window.setTimeout(() => {
                    history.push("/login");
                  }, 350);
                }
              }}
            >
              {logged.isLogged ? "Log Out" : "Log In"}
            </Button>
          </Box>
        </Box>
      </>
    );
  } else {
    return <div>Mobile view</div>;
  }
}
