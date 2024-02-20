import * as React from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@mui/material";
import { Box } from "@mui/material";

export default function SimpleAlert({ isOpen, setOpen, message, severity }) {
  React.useEffect(() => {
    setOpen(false);
  }, []);

  if (!isOpen) {
    return <></>;
  }

  return (
    <Alert
      sx={{ textAlign: "center" }}
      severity={severity}
      action={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Button
            variant="text"
            sx={{ color: "black" }}
            onClick={() => {
              setOpen(false);
            }}
          >
            X
          </Button>
        </Box>
      }
    >
      {message}
    </Alert>
  );
}
