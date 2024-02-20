import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

/**
 * @param { Boolean } open, it is state to control open and close of the dialogbox
 *
 * @param { Object.function } setOpen
 *
 *
 * @param {String} btnContent
 *          Content inside the Btn,
 * @param {String} btnVariant
 *          MUI button Variant
 * @param { Object } btnSx
 *          MUI Styling object SX
 * @param { String } title
 *          Title Text
 * @param { String } content
 *          Content Text
 * @param { form } form
 *          Form Component
 * @param { Object.function } onClose
 *          Function: params - success
 */
export default function FormDialog({
  open,
  setOpen,
  title,
  content,
  form,
  onClose = () => {},
  removeCancel = false,
  replaceCancelWith = "",
}) {
  const handleClose = (success) => {
    onClose(success);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => {
          handleClose(false);
        }}
        maxWidth="60rem"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ overflow: "hidden" }}>
          <DialogContentText>{content}</DialogContentText>
          {form}
        </DialogContent>
        <DialogActions>
          {!removeCancel ? (
            <Button
              onClick={() => {
                handleClose(false);
              }}
            >
              {replaceCancelWith === "" ? "Cancel" : replaceCancelWith}
            </Button>
          ) : (
            <></>
          )}
          <Button
            onClick={() => {
              handleClose(true);
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
