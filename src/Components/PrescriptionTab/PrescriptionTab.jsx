import { useState } from "react";
import "./prescription-tab.css";

import SimpleAlert from "../Alert/Alert";

import BasicTable from "../BasicTable/BasicTable";
import FormDialog from "../FormDialog/FormDialog";

import AddPrescription from "./AddPrescription";
import ViewPrescription from "./ViewPrescription";

import { setPrescription as putPrescription } from "../NetworkCalls/prescription";

export default function PrescriptionTab({
  medicines,
  patients,
  setPatients,
  logged,
}) {
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "error",
  });

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
      <div className="patient-bar"></div>
      <BasicTable
        headers={["Name", "Add/Edit Prescription", "View Prescription"]}
        rows={patients.map((val, i) => [
          val.name,
          <>
            <FormDialog
              btnContent="Add / Edit Prescription"
              btnVariant="outlined"
              btnSx={{ fontSize: "0.70rem" }}
              title="Add / Update Prescription"
              content=""
              form={
                <AddPrescription
                  name={val.name}
                  age={val.age}
                  bmi={val.bmi}
                  medicines={medicines}
                  prescription={val.prescription}
                  setPrescription={(prescription) => {
                    if (
                      prescription.medicineName !== "" &&
                      prescription.doze !== ""
                    )
                      setPatients((prevPres) => {
                        return prevPres.map((p) => {
                          if (p._id === val._id) {
                            return {
                              ...p,
                              prescription,
                            };
                          } else return p;
                        });
                      });
                  }}
                />
              }
              onClose={async () => {
                let map = new Map();
                for (let i = 0; i < medicines.length; i++) {
                  map.set(
                    `${medicines[i].medicineName} ${medicines[i].doze}`,
                    medicines[i]._id
                  );
                }

                let presc = val.prescription.map((p, i) => {
                  return {
                    medID: map.get(`${p.medicineName} ${p.doze}`),
                    times: p.times,
                  };
                });
                await putPrescription(
                  logged.token,
                  (message, severity) => {
                    setAlert({ isOpen: true, message, severity });
                  },
                  val._id,
                  presc
                );
              }}
              removeCancel
            />
          </>,
          <FormDialog
            btnContent="View Prescription"
            btnVariant="outlined"
            btnSx={{ mr: "1rem", fontSize: "0.7rem" }}
            title="View Prescription"
            content=""
            form={
              <ViewPrescription
                name={val.name}
                age={val.age}
                bmi={val.bmi}
                prescription={val.prescription}
              />
            }
            removeCancel
          />,
        ])}
      />
    </>
  );
}
