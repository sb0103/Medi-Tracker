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
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import BasicTable from "../BasicTable/BasicTable";
import FormDialog from "../FormDialog/FormDialog";
import SimpleAlert from "../Alert/Alert";
import { addMedicine, modifyMedicine } from "../NetworkCalls/medicines";

import "./medicineTab.css";
import { useState } from "react";

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
    //Verification for if same medName+doze already exists
    let meds = new Set();

    for (let j = 0; j < medicines.length; j++) {
      meds.add(`${medicines[j].medicineName} ${medicines[j].doze}`);
    }

    for (let i = 0; i < formData.length; i++) {
      if (meds.has(`${formData[i].medicineName} ${formData[i].doze}`)) {
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
            let failedIdx = [];

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
                if (medID !== false) {
                  medArr[i]._id = medID;
                } else {
                  failedIdx.push(i);
                }
              }
              medArr = medArr.filter(
                (value, idx) => failedIdx.findIndex((i) => i === idx) === -1
              );
              setMedicines((medicines) => [...medicines, ...medArr]);
            } else if (success) {
              setAlert({
                isOpen: true,
                message:
                  "Verification for the medicines has failed.\n Kindly check if the medicine doesn't already exists, and medicine name and doze  has atleast 3 letter/number.",
                severity: "error",
              });
            }
          }}
          onOpen={() => {
            setFormInput([{ medicineName: "", doze: "" }]);
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

              <Button
                onClick={() => {
                  setFormInput(formInput.filter((v, idx) => i !== idx));
                }}
              >
                <DeleteOutlineOutlinedIcon color="red" />
              </Button>
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
      btnProps={{ color: "secondary" }}
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
