import {
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import BasicTable from "../BasicTable/BasicTable";
import FormDialog from "../FormDialog/FormDialog";

import "./medicineTab.css";
import { useState } from "react";

const fetchMedicines = () => {
  return [
    {
      _id: 32942531,
      name: "Name1",
      doze: "100mg",
      description: "",
    },
    {
      _id: 32942532,
      name: "Name2",
      doze: "100mg",
      description: "",
    },
    {
      _id: 32942533,
      name: "Name3",
      doze: "100mg",
      description: "",
    },
    {
      _id: 32942534,
      name: "Name4",
      doze: "100mg",
      description: "",
    },
    {
      _id: 32942535,
      name: "Name5",
      doze: "100mg",
      description: "",
    },
  ];
};

export default function MedicineTab({ medicines, setMedicines }) {
  const [formInput, setFormInput] = useState([{ medicineName: "", doze: "" }]);
  const [formInput2, setFormInput2] = useState({ medicineName: "", doze: "" });

  return (
    <>
      <div className="medicine-bar">
        <FormDialog
          btnSx={{ mr: "1rem" }}
          btnContent={"Add Medicine"}
          btnVariant={"outlined"}
          title={"Add Medicine"}
          content={""}
          form={
            <AddMedicine formInput={formInput} setFormInput={setFormInput} />
          }
          onClose={(success) => {
            if (success && formInput.name !== "" && formInput.doze !== "")
              setMedicines((medicines) => [...medicines, ...formInput]);
            /**
             * //TODO: NETWORK CALL
             *
             *  Make a network call and add the medicine to the medicines State
             *
             */
          }}
          onOpen={() => {
            setFormInput([{ medicineName: "", doze: "" }]);
          }}
        />
        <FormDialog
          btnContent={"Add Doze"}
          btnVariant={"outlined"}
          btnSx={{ mr: "1rem" }}
          title={"Add Doze"}
          content={""}
          form={
            <AddDoze
              medicines={medicines.map((val) => val.medicineName)}
              formInput={formInput2}
              setFormInput={setFormInput2}
            />
          }
          onClose={(success) => {
            if (success) {
              setMedicines((meds) => [...meds, formInput2]);
            }
          }}
          /**
           *  TODO NetWorkcall
           *
           *  Make a network call and add the medicine to the medicines State
           *
           */

          onOpen={() => {
            setFormInput2({ medicineName: "", doze: "" });
          }}
        />
      </div>
      <BasicTable
        headers={["Name", "Doze", "Description", "Actions"]}
        rows={medicines.map((med) => [
          med.medicineName,
          med.doze,
          med.description,
          <MedicineActionBar setMedicines={setMedicines} _id={med._id} />,
        ])}
      />
    </>
  );
}

function AddMedicine({ formInput, setFormInput }) {
  return (
    <div style={{ width: "55rem", maxWidth: "90vw" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            setFormInput((meds) => [...meds, { medicineName: "", doze: "" }]);
          }}
        >
          Add
        </Button>
      </Box>
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {formInput.map((item, i) => {
          return (
            <Stack
              key={`input${i}a`}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "90%",
                flexDirection: "row",
              }}
            >
              <TextField
                sx={{ width: "40%", m: "1rem" }}
                variant="outlined"
                label="Medicine Name"
                Value={item.medicineName}
                onChange={(e) => {
                  setFormInput((meds) => {
                    return meds.map((med, idx) => {
                      if (i !== idx) {
                        return med;
                      } else {
                        return { medicineName: e.target.value, doze: "" };
                      }
                    });
                  });
                }}
              />

              <TextField
                key={`input${i}b`}
                sx={{ width: "40%", m: "1rem" }}
                variant="outlined"
                label="Doze"
                Value={item.doze}
                onChange={(e) => {
                  setFormInput((meds) => {
                    return meds.map((med, idx) => {
                      if (i !== idx) {
                        return med;
                      } else {
                        return {
                          medicineName: med.medicineName,
                          doze: e.target.value,
                        };
                      }
                    });
                  });
                }}
              />
            </Stack>
          );
        })}
      </Stack>
    </div>
  );
}

function AddDoze({ medicines, formInput, setFormInput }) {
  return (
    <>
      <Stack
        sx={{
          display: "flex",
          m: "2rem",
          height: "8rem",
          justifyContent: "space-between",
          alignItems: "center",
          width: "25rem",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="label1">Select Medicine</InputLabel>
          <Select
            sx={{ width: "100%", color: "grey" }}
            labelId="label1"
            label="Select Medicine"
            value={formInput.medicineName}
            onChange={(e) => {
              setFormInput((val) => {
                return { ...val, medicineName: e.target.value };
              });
            }}
          >
            {medicines.map((med) => {
              return <MenuItem value={med}>{med}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Doze"
          Value={formInput.doze}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, doze: e.target.value };
            });
          }}
        />
      </Stack>
    </>
  );
}

function MedicineActionBar({ _id, setMedicines }) {
  return (
    <Button
      onClick={() => {
        setMedicines((prevState) => {
          return prevState.filter((val) => val._id !== _id);
        });

        //TODO: NETWORK CALL
      }}
    >
      <DeleteRoundedIcon />
    </Button>
  );
}
