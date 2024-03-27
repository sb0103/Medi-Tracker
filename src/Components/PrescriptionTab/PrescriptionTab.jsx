import { useState } from "react";
import "./prescription-tab.css";

import SimpleAlert from "../Alert/Alert";

import BasicTable from "../BasicTable/BasicTable";
import FormDialog from "../FormDialog/FormDialog";
import FormDialogWithoutBtn from "../FormDialog/FormDialogWithoutBtn";

import AddPrescription from "./AddPrescription";
import ViewPrescription from "./ViewPrescription";

import { setPrescription as putPrescription } from "../NetworkCalls/prescription";
import { clearTracker } from "../NetworkCalls/tracker";
import { Typography } from "@mui/material";
import dayjs from "dayjs";

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

  const [dialogBox, setDialogBox] = useState(false);
  //TrackerInfo
  const [toClearPatientID, setToClearPatientID] = useState("");

  const [tempPres, setTempPres] = useState({});

  const verifyPrescription = (presc) => {
    let res = true;

    presc.forEach((med) => {
      let firstDay = med?.times?.firstDay;
      let lastDay = med?.times?.lastDay;

      if (!firstDay || !lastDay) {
        setAlert({
          isOpen: true,
          message: `No value for "Start Date" or "End Date" provided`,
          severity: "error",
        });

        res = false;
      }

      firstDay = dayjs(firstDay, "D/M/YYYY");
      lastDay = dayjs(lastDay, "D/M/YYYY");
      if (lastDay.isBefore(firstDay, "d")) {
        setAlert({
          isOpen: true,
          message: `Invalid value for "Start Date" or "End Date" provided`,
          severity: "error",
        });

        res = false;
      }

      let repetations = med?.times?.repetations;

      if (repetations.length === 0) {
        setAlert({
          isOpen: true,
          message: `No timings provided for the medicine`,
          severity: "error",
        });

        res = false;
      }
    });

    return res;
  };

  return (
    <>
      <FormDialogWithoutBtn
        open={dialogBox}
        setOpen={setDialogBox}
        title="Do you want to clear old tracker data?"
        content=""
        form={
          <Typography sx={{ fontWeight: 300 }}>
            This action will clear All the Tracker data, procced with caution
            <br />
            only clear the data if it is not just an addition of new medicine
            <br />
            but a new prescription for the patient.
          </Typography>
        }
        onClose={async (success) => {
          if (success) {
            await clearTracker(
              logged.token,
              (message, severity) => {
                setAlert({ isOpen: true, message, severity });
              },
              toClearPatientID
            );
          }
        }}
      />
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
              onClose={async (success) => {
                if (success && verifyPrescription(val.prescription)) {
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
                  if (
                    await putPrescription(
                      logged.token,
                      (message, severity) => {
                        setAlert({ isOpen: true, message, severity });
                      },
                      val._id,
                      presc
                    )
                  ) {
                    setToClearPatientID(val._id);
                    setDialogBox(true);
                  }
                } else {
                  let fn = (prescription) => {
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
                  };

                  fn(tempPres);
                }
              }}
              onOpen={() => {
                setTempPres(val.prescription);
              }}
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
