import { useEffect, useState } from "react";
import "./navBar.css";
import { Button, Avatar, colors } from "@mui/material";

export default function NavBar({ userName, avatarSrc }) {
  let [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.screen.availWidth <= 500);
    });
  }, []);

  if (!isMobile) {
    return (
      <>
        <div className="nav-bar">
          <div className="nav-bar-logo">Medi-Tracker</div>
          <div className="nav-bar-leftGroup">
            <Avatar
              sx={{ bgcolor: "#eeeeee" }}
              alt={userName}
              src={avatarSrc}
            />
            <Button sx={{ color: "white", fontSize: "1.25rem" }}>Login</Button>
          </div>
        </div>
      </>
    );
  } else {
    return <div>Mobile view</div>;
  }
}
