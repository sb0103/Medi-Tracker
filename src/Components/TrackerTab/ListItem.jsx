import { useState, useEffect } from "react";

import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

import UnEditIcon from "@mui/icons-material/EditOffOutlined";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function ListItem({
  medicines = [],
  listItem,
  i,
  removeListItem = () => {},
  setListItem = () => {},
  viewOnly = false,
}) {
  const [editState, setEditState] = useState(false);
  const [listVal, setListVal] = useState([]);

  useEffect(() => {
    setListVal(listItem);
    if (listItem.medicineName === "" && listItem.doze === "") {
      setEditState(true);
    }
  }, []);

  if (editState === false) {
    return (
      <div className="medicine">
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>{listVal.medicineName}</Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 300 }}> {listVal.doze} </Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 300 }}> {listVal.quantity} </Typography>
        </div>
        {viewOnly === false ? (
          <div className="pres-btn-bar">
            <Button
              color="red"
              onClick={() => {
                removeListItem();
              }}
            >
              <DeleteIcon color="red" />
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                setEditState(true);
              }}
            >
              <EditIcon color="secondary" />
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return (
      <div className="medicine">
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id={`label${i}1`}>Select Medicine</InputLabel>
            <Select
              sx={{ width: "100%", color: "grey" }}
              labelId={`label${i}1`}
              label="Select Medicine"
              value={listVal.medicineName}
              onChange={(e) => {
                setListVal((prevState) => {
                  return {
                    ...prevState,
                    medicineName: e.target.value,
                    doze: "",
                    quantity: 0,
                  };
                });
              }}
            >
              <MenuItem key={"NONE"} value={""}>
                None
              </MenuItem>
              {medicines.map((med, idx1) => {
                return (
                  <MenuItem key={idx1} value={med.medicineName}>
                    {med.medicineName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id={`label${i}2`}>Select Doze</InputLabel>
            <Select
              sx={{ width: "100%", color: "grey" }}
              labelId={`label${i}2`}
              label="Select Doze"
              value={listVal.doze}
              onChange={(e) => {
                setListVal((prevState) => {
                  return { ...prevState, doze: e.target.value, quantity: 0 };
                });
              }}
            >
              <MenuItem key={"NONE"} value={""}>
                None
              </MenuItem>
              {medicines
                .filter((med) => med.medicineName === listVal.medicineName)
                .map((med, idx) => {
                  return (
                    <MenuItem key={idx} value={med.doze}>
                      {med.doze}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextField
            variant="outlined"
            value={listVal.quantity}
            label="Quantity"
            onChange={(e) => {
              setListVal((prevState) => {
                return { ...prevState, quantity: e.target.value };
              });
            }}
          />
        </div>
        <div className="pres-btn-bar">
          <Button
            color="red"
            onClick={() => {
              removeListItem();
            }}
          >
            <DeleteIcon color="red" />
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setListItem(listVal);
              setEditState(false);
            }}
          >
            <UnEditIcon color="secondary" />
          </Button>
        </div>
      </div>
    );
  }
}
