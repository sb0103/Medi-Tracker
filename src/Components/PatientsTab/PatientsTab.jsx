import "./patients-tab.css";
import { Button, Stack, TextField } from "@mui/material";
import FormDialog from "../FormDialog/FormDialog";
import BasicTable from "../BasicTable/BasicTable";
import { useEffect, useState } from "react";

export default function PatientsTab({ patients, setPatient }) {
  const [formInput, setFormInput] = useState({
    name: "",
    age: 34,
    bmi: 8,
    otherDetails: "",
  });

  return (
    <>
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
          onClose={(success) => {
            if (
              success &&
              formInput.name !== "" &&
              formInput.age !== "" &&
              formInput.bmi !== ""
            ) {
              setPatient((prevState) => {
                return [
                  ...prevState,
                  { ...formInput, prescription: [], inventory: [] },
                ];
              });
            }
          }}
        />
      </div>
      <BasicTable
        headers={["Name", "Age", "BMI", "Other Details"]}
        rows={patients.map((p) => [p.name, p.age, p.bmi, p.otherDetails])}
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
          Value={formInput.name}
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
          Value={formInput.age}
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
          Value={formInput.bmi}
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
          Value={formInput.otherDetails}
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
