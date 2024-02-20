import { useEffect, useState } from "react";
import "./navBar.css";
import { Button, Avatar, Typography } from "@mui/material";
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
        <div className="nav-bar">
          <div className="nav-bar-logo">
            <img className="logo-img" src="./logo.png" alt="" />
            Medi-Tracker
          </div>
          <div className="nav-bar-leftGroup">
            <Avatar
              sx={{ bgcolor: "#eeeeee" }}
              alt={userDetails.username}
              src={avatarSrc}
            />

            {logged.isLogged ? (
              <Typography color={"white"}>{userDetails.username}</Typography>
            ) : (
              <></>
            )}
            <Button
              sx={{
                color: "white",
                fontSize: "1rem",
                textWrap: "false",
                width: "7rem",
              }}
              onClick={() => {
                if (logged.isLogged) {
                  setLogged({ isLogged: false, token: "" });
                  history.push("/login");
                } else {
                  history.push("/login");
                }
              }}
            >
              {logged.isLogged ? "Log Out" : "Log In"}
            </Button>
          </div>
        </div>
      </>
    );
  } else {
    return <div>Mobile view</div>;
  }
}
