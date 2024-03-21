import { useState, useEffect } from "react";

import UnEditIcon from "@mui/icons-material/EditOffOutlined";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";

import dayjs from "dayjs";

import {
  Typography,
  FormControl,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Divider,
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
  const [tempTime, setTempTime] = useState({});

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
            flexDirection: "column",
          }}
        >
          <FormDialog
            btnContent={"View Timings"}
            btnVariant="text"
            btnSx={{ fontSize: "0.7rem" }}
            title={"View Timings"}
            content=""
            form={
              /**
               * times = {repetations, firstDay, lastDay, day, date}
               */
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
          <Divider />
          <Typography sx={{ fontSize: "0.5rem", color: "#909090" }}>
            From:{" "}
            {listItem.times?.firstDay === undefined
              ? ""
              : dayjs(listItem.times?.firstDay, "D/M/YYYY").format(
                  "DD/MMM/YYYY"
                )}
            <br />
            To:{" "}
            {listItem.times?.lastDay === undefined
              ? ""
              : dayjs(listItem.times?.lastDay, "D/M/YYYY").format(
                  "DD/MMM/YYYY"
                )}
            <br />
            {listItem.times?.format === undefined
              ? ""
              : listItem.times?.format.toLocaleUpperCase()}
          </Typography>
        </div>

        {viewOnly === false ? (
          <div className="pres-btn-bar">
            <Button
              color="red"
              variant="text"
              onClick={() => {
                removeListItem();
              }}
            >
              <DeleteIcon color="red" />
            </Button>
            <Button
              color="secondary"
              variant="text"
              onClick={() => {
                setEditState(true);
              }}
            >
              <EditIcon color="secondary" />
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
            flexDirection: "column",
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
            // Added cancel btn alongs with its functionality
            onOpen={() => {
              setTempTime(listItem.times);
            }}
            onClose={(success) => {
              if (!success) {
                let fn = (times) => {
                  setListItem({ ...listItem, times }, i);
                };

                fn(tempTime);
              }
            }}
          />
          <Typography sx={{ fontSize: "0.5rem", color: "#909090" }}>
            From:{" "}
            {listItem.times?.firstDay === undefined
              ? ""
              : dayjs(listItem.times?.firstDay, "D/M/YYYY").format(
                  "DD/MMM/YYYY"
                )}
            <br />
            To:{" "}
            {listItem.times?.lastDay === undefined
              ? ""
              : dayjs(listItem.times?.lastDay, "D/M/YYYY").format(
                  "DD/MMM/YYYY"
                )}
            <br />
            {listItem.times?.format === undefined
              ? ""
              : listItem.times?.format.toLocaleUpperCase()}
          </Typography>
        </div>
        <div className="pres-btn-bar">
          <Button
            color="red"
            variant="text"
            onClick={() => {
              removeListItem();
            }}
          >
            <DeleteIcon color="red" />
          </Button>
          <Button
            color="secondary"
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
            <UnEditIcon color="secondary" />
          </Button>
        </div>
      </div>
    );
  }
}
