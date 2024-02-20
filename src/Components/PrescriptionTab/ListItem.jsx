import { useState, useEffect } from "react";

import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import {
  Typography,
  FormControl,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FormDialog from "../FormDialog/FormDialog";

import SelectTimings from "./SelectTimings";

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
    if (
      listItem.medicineName === "" &&
      listItem.doze === "" &&
      viewOnly === false
    ) {
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
          <Typography>{listItem.medicineName}</Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography> {listItem.doze} </Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormDialog
            btnContent={"View Timings"}
            btnVariant="text"
            btnSx={{ fontSize: "0.7rem" }}
            title={"View Timings"}
            content=""
            form={
              <SelectTimings
                times={listItem.times}
                setTimes={(times) => {
                  setListItem({ ...listItem, times }, i);
                }}
                viewOnly={true}
              />
            }
            removeCancel
          />
        </div>

        {viewOnly === false ? (
          <div className="pres-btn-bar">
            <Button
              variant="text"
              onClick={() => {
                removeListItem();
              }}
            >
              <DeleteRoundedIcon color="primary" />
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setEditState(true);
              }}
            >
              <EditRoundedIcon color="primary" />
            </Button>
          </div>
        ) : (
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {listItem.description}
          </div>
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
              value={listItem.medicineName}
              onChange={(e) => {
                setListItem(
                  {
                    ...listItem,
                    medicineName: e.target.value,
                    doze: "",
                  },
                  i
                );

                // setListVal((prevState) => {
                //   return {
                //     ...prevState,
                //     medicineName: e.target.value,
                //     doze: "",
                //   };
                // });
              }}
            >
              <MenuItem key={"none"} value={""}>
                None
              </MenuItem>
              {medicines.map((med, i) => {
                return (
                  <MenuItem key={`med ${i}`} value={med.medicineName}>
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
              value={listItem.doze}
              onChange={(e) => {
                setListItem({ ...listItem, doze: e.target.value }, i);

                // setListVal((prevState) => {
                //   return { ...prevState, doze: e.target.value };
                // });
              }}
            >
              <MenuItem key={"None"} value={""}>
                None
              </MenuItem>
              {medicines
                .filter((med) => med.medicineName === listItem.medicineName)
                .map((med, i) => {
                  return (
                    <MenuItem key={`doze ${i}`} value={med.doze}>
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
          <FormDialog
            btnContent={"Set Timings"}
            btnVariant={"text"}
            title={"Set Timings"}
            content=""
            form={
              <SelectTimings
                times={listItem.times}
                setTimes={(times) => {
                  setListItem({ ...listItem, times }, i);
                }}
                viewOnly={viewOnly}
              />
            }
            removeCancel
          />
        </div>
        <div className="pres-btn-bar">
          <Button
            variant="text"
            onClick={() => {
              removeListItem();
            }}
          >
            <DeleteRoundedIcon color="primary" />
          </Button>
          <Button
            variant="text"
            onClick={() => {
              let _id = medicines.find((med) => {
                return (
                  med.medicineName === listItem.medicineName &&
                  med.doze === listItem.doze
                );
              })?._id;
              setListItem({ ...listItem, medID: _id }, i);
              setEditState(false);
            }}
          >
            <SaveRoundedIcon color="primary" />
          </Button>
        </div>
      </div>
    );
  }
}
