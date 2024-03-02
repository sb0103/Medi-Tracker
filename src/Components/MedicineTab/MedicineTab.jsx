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
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

import BasicTable from "../BasicTable/BasicTable";
import FormDialog from "../FormDialog/FormDialog";
import SimpleAlert from "../Alert/Alert";
import { addMedicine, modifyMedicine } from "../NetworkCalls/medicines";

import "./medicineTab.css";
import { useState } from "react";
import { Palette } from "@mui/icons-material";

export default function MedicineTab({ medicines, setMedicines, logged }) {
  const [formInput, setFormInput] = useState([
    { medicineName: "", doze: "", description: "" },
  ]);
  const [formInput2, setFormInput2] = useState({ medicineName: "", doze: "" });
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "error",
  });

  const verifyMedicineData = (formData) => {
    for (let i = 0; i < formData.length; i++) {
      if (formData[i].medicineName.length < 3 && formData[i].doze.length < 3) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <SimpleAlert
        isOpen={alert.isOpen}
        setOpen={(b) => {
          setAlert((ov) => {
            return { ...ov, isOpen: b };
          });
        }}
        message={alert.message}
        severity={alert.severity}
      />
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
          onClose={async (success) => {
            if (success && verifyMedicineData(formInput)) {
              let medArr = formInput;

              for (let i = 0; i < formInput.length; i++) {
                let medID = await addMedicine(
                  logged.token,
                  (message, severity) => {
                    setAlert({ isOpen: true, message, severity });
                  },
                  medArr[i]
                );

                medArr[i]._id = medID;
              }

              setMedicines((medicines) => [...medicines, ...medArr]);
            } else if (success) {
              setAlert({
                isOpen: true,
                message: "Invalid Medicine name or Doze",
                severity: "error",
              });
            }
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
          onClose={async (success) => {
            if (
              success &&
              formInput2.medicineName.length >= 3 &&
              formInput2.doze.length >= 3
            ) {
              setMedicines((meds) => [...meds, formInput2]);
              setAlert({
                isOpen: true,
                message: "Doze successfully Added",
                severity: "success",
              });

              await addMedicine(
                logged.token,
                (message, severity) => {
                  setAlert({ isOpen: true, message, severity });
                },
                formInput2
              );
            } else if (success) {
              setAlert({
                isOpen: true,
                message: "Invalid Doze",
                severity: "error",
              });
            }
          }}
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
          <MedicineActionBar
            medicines={medicines}
            setMedicines={setMedicines}
            _id={med._id}
            logged={logged}
            setAlert={setAlert}
          />,
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
            setFormInput((meds) => [
              ...meds,
              { medicineName: "", doze: "", description: "" },
            ]);
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
                value={item.medicineName}
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
                value={item.doze}
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
              <TextField
                key={`input${i}c`}
                sx={{ width: "40%", m: "1rem" }}
                variant="outlined"
                label="Description"
                value={item.description}
                onChange={(e) => {
                  setFormInput((meds) => {
                    return meds.map((med, idx) => {
                      if (i !== idx) {
                        return med;
                      } else {
                        return {
                          medicineName: med.medicineName,
                          doze: med.doze,
                          description: e.target.value,
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
          value={formInput.doze}
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

function EditMedicine({ formInput, setFormInput }) {
  return (
    <>
      <Stack
        sx={{
          display: "flex",
          m: "2rem",
          height: "10rem",
          justifyContent: "space-between",
          alignItems: "center",
          width: "25rem",
          rowGap: "1rem",
        }}
      >
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Medicine Name"
          value={formInput.medicineName}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, medicineName: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Doze"
          value={formInput.doze}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, doze: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Description"
          value={formInput.description}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, description: e.target.value };
            });
          }}
        />
      </Stack>
    </>
  );
}

function MedicineActionBar({ medicines, _id, setMedicines, logged, setAlert }) {
  const [formInput, setFormInput] = useState({
    _id,
    medicineName: "",
    doze: "",
    description: "",
  });

  const verifyMedicineData = (data) => {
    if (data.medicineName.length < 1 || data.doze.length < 1) {
      return false;
    }
    return true;
  };

  return (
    <FormDialog
      btnContent={<ModeEditOutlineOutlinedIcon color="secondary" />}
      btnVariant="outlined"
      btnSx={{ color: "secondary" }}
      btnClassName="edit-btn"
      title="Edit Medicine Details"
      content=""
      form={<EditMedicine formInput={formInput} setFormInput={setFormInput} />}
      onOpen={() => {
        let med = medicines.find((med) => {
          return med._id === _id;
        });
        if (!med) {
          throw new Error(`Error finding the medicine with the _id: ${_id}`);
        }

        setFormInput(med);
      }}
      onClose={async (success) => {
        if (success && verifyMedicineData(formInput)) {
          if (
            await modifyMedicine(
              logged.token,
              (message, severity) => {
                setAlert({ isOpen: true, message, severity });
              },
              {
                medicineName: formInput.medicineName,
                doze: formInput.doze,
                description: formInput.description,
                medID: formInput._id,
              }
            )
          ) {
            setMedicines((meds) => {
              return meds.map((med) => {
                if (med._id === _id) {
                  return formInput;
                } else {
                  return med;
                }
              });
            });
          }
        }
      }}
    />
  );
}
