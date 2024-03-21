import "./patients-tab.css";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import FormDialog from "../FormDialog/FormDialog";
import BasicTable from "../BasicTable/BasicTable";
import { useEffect, useState } from "react";
import SimpleAlert from "../Alert/Alert";
import {
  addPatient,
  deletePatient,
  modifyPatient,
} from "../NetworkCalls/patients";

import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function PatientsTab({ patients, setPatient, logged }) {
  const [formInput, setFormInput] = useState({
    name: "",
    age: 0,
    bmi: 0,
    otherDetails: "",
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "error",
  });

  const verifyPatientForm = (formInput) => {
    const { name, age, bmi, otherDetails } = formInput;

    if (name.length < 3 || name.length > 50) {
      setAlert({
        isOpen: true,
        message: "Name should be of length between 3 and 50 ",
        severity: "error",
      });
      return false;
    }

    if (age < 0 || age > 135) {
      setAlert({
        isOpen: true,
        message: "Age should be between between 0 and 150 ",
        severity: "error",
      });

      return false;
    }

    if (bmi < 8 || bmi > 50) {
      setAlert({
        isOpen: true,
        message: "BMI should be between between 8 and 50 ",
        severity: "error",
      });

      return false;
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
      <div className="patient-bar">
        <FormDialog
          btnContent="Add Patient"
          btnSx={{ mr: "1rem" }}
          btnVariant="outlined"
          title="Add Patient"
          content=""
          form={
            <AddPatient formInput={formInput} setFormInput={setFormInput} />
          }
          onOpen={() => {
            setFormInput({
              name: "",
              age: 0,
              bmi: 0,
              otherDetails: "",
            });
          }}
          onClose={async (success) => {
            if (success && verifyPatientForm(formInput)) {
              let _id = await addPatient(
                logged.token,
                (message, severity) => {
                  setAlert({ isOpen: true, message, severity });
                },
                formInput
              );
              if (!!_id) {
                setPatient((prevState) => {
                  return [
                    ...prevState,
                    { ...formInput, prescription: [], inventory: [], _id },
                  ];
                });
              }
            }
          }}
        />
      </div>
      <BasicTable
        headers={["Name", "Age", "BMI", "Other Details", "Actions"]}
        rows={patients.map((p) => [
          p.name,
          p.age,
          p.bmi,
          p.otherDetails,
          <>
            <PatientActionBar
              _id={p._id}
              patient={p}
              setPatient={setPatient}
              logged={logged}
              setAlert={setAlert}
              verifyPatientForm={verifyPatientForm}
            />
          </>,
        ])}
      />
    </>
  );
}

function AddPatient({ formInput, setFormInput }) {
  return (
    <div>
      <Stack
        sx={{
          display: "flex",
          m: "2rem",
          height: "16rem",
          justifyContent: "space-between",
          alignItems: "center",
          width: "25rem",
        }}
      >
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Patient Name"
          value={formInput.name}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, name: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Patient Age"
          value={formInput.age}
          type="number"
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, age: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Patient BMI"
          type="number"
          value={formInput.bmi}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, bmi: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Other Details"
          value={formInput.otherDetails}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, otherDetails: e.target.value };
            });
          }}
          multiline
        />
      </Stack>
    </div>
  );
}

function EditPatient({ formInput, setFormInput }) {
  return (
    <div>
      <Stack
        sx={{
          display: "flex",
          m: "2rem",
          height: "16rem",
          justifyContent: "space-between",
          alignItems: "center",
          width: "25rem",
        }}
      >
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Patient Name"
          value={formInput.name}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, name: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Patient Age"
          value={formInput.age}
          type="number"
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, age: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Patient BMI"
          type="number"
          value={formInput.bmi}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, bmi: e.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: "100%" }}
          variant="outlined"
          label="Other Details"
          value={formInput.otherDetails}
          onChange={(e) => {
            setFormInput((val) => {
              return { ...val, otherDetails: e.target.value };
            });
          }}
          multiline
        />
      </Stack>
    </div>
  );
}

function PatientActionBar({
  _id,
  patient,
  logged,
  setAlert,
  setPatient,
  verifyPatientForm,
}) {
  let [formInput, setFormInput] = useState(patient);

  return (
    <Box
      sx={{
        display: "flex",
        direction: "row",
        columnGap: "1rem",
        justifyContent: "center",
      }}
    >
      <FormDialog
        btnContent={<ModeEditOutlineOutlinedIcon color="secondary" />}
        btnVariant="outlined"
        btnSx={{ color: "secondary" }}
        btnClassName="edit-btn"
        title="Edit Patient Details"
        content=""
        form={<EditPatient formInput={formInput} setFormInput={setFormInput} />}
        onClose={async (success) => {
          if (success && verifyPatientForm(formInput)) {
            if (
              await modifyPatient(
                logged.token,
                (message, severity) => {
                  setAlert({ isOpen: true, message, severity });
                },
                _id,
                {
                  name: formInput.name,
                  age: formInput.age,
                  bmi: formInput.bmi,
                  otherDetails: formInput.otherDetails,
                }
              )
            ) {
              setPatient((ps) =>
                ps.map((p) => {
                  if (p._id === _id) {
                    return formInput;
                  } else {
                    return p;
                  }
                })
              );
            }
          }
        }}
      />

      {/* <Button color="error" variant="outlined">
        <DeleteOutlineOutlinedIcon color="error" />
      </Button> */}

      <FormDialog
        btnContent={<DeleteOutlineOutlinedIcon color="red" />}
        btnVariant="outlined"
        btnSx={{ color: "red" }}
        btnClassName="delete-btn"
        title="Delete Patient"
        content=""
        form={
          <Box
            sx={{
              display: "flex",
              direction: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 300 }}>
              This Action will delete all the purchases, tracker information as
              well as the prescription details of the patient
              <br /> Do you want to move forward with the action?
            </Typography>
          </Box>
        }
        onClose={async (success) => {
          if (success) {
            if (
              await deletePatient(
                logged.token,
                (message, severity) => {
                  setAlert({ isOpen: true, message, severity });
                },
                _id
              )
            ) {
              setPatient((ps) => ps.filter((p) => p._id !== _id));
            }
          }
        }}
      />
    </Box>
  );
}
