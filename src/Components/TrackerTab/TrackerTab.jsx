import { useEffect, useState, useMemo } from "react";

import "./tracker-tab.css";

import FormDialog from "../FormDialog/FormDialog";
import SimpleAlert from "../Alert/Alert";
import Badge from "@mui/material/Badge";

import dayjs from "dayjs";

import BasicTable from "../BasicTable/BasicTable";
import AddPurchase from "./AddPurchase";
import TrackMedicine from "./TrackMedicine";

import WebWorker from "../WebWorker/webWorker.ts";

import { postPurchase } from "../NetworkCalls/purchase";
import { postTracker as pTracker, getTracker } from "../NetworkCalls/tracker";
import { fetchInventory } from "../NetworkCalls/inventory";
import { getPurchases } from "../NetworkCalls/purchase";

import { TRACKER_START_MONTH } from "../../config/config";
import { Box } from "@mui/material";

export default function TrackerTab({ medicines, patients, logged }) {
  const [trackerTable, setTrackerTable] = useState({
    tracker: {
      details: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    },
  });
  const [month, setMonth] = useState("January 2024");
  const [workerInstance, setWorkerInstance] = useState(null);

  const [availableMonths, setAvailableMonths] = useState([
    "January 2024",
    "December 2023",
  ]);
  const [allowMonthsAhead, setAllowMonthsAhead] = useState(6);

  const [formInputPurchase, setFormInputPurchase] = useState([
    { medicineName: "", doze: "", quantity: 0 },
  ]);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toUTCString());

  const [patientsAllTracker, setPatientsAllTracker] = useState([]);

  const [patientBadges, setPatientBadges] = useState([]);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "error",
  });

  const fetchAllTracker = async (patientID) => {
    let tracker = await getTracker(
      logged.token,
      (message, severity) => {
        setAlert({ isOpen: true, message, severity });
      },
      patientID
    );

    setPatientsAllTracker(tracker);
    return tracker;
  };

  const fetchTracker = (patientsAllTracker, patientID, month) => {
    let tracker = patientsAllTracker.find((t) => {
      return t.month.match(new RegExp(`${month}`, "i")) !== null;
    });

    //If Tracker exists return in the new Format if it doesn't exist return an empty trackerObj
    if (tracker) {
      return {
        _id: patientID,
        tracker,
      };
    } else {
      let details = [];
      let [m, y] = month.split(" ");
      let ds = dayjs(`1/${m}/${y}`, "D/MMMM/YYYY").daysInMonth();

      for (let i = 0; i < ds; i++) {
        details.push([]);
      }

      return {
        _id: patientID,
        tracker: {
          month,
          details,
        },
      };
    }
  };

  const addUpdateTracker = async (patientID, month, trackerObj) => {
    let details = trackerObj.details;

    let formattedDetails = details.map((dateArr) => {
      return dateArr.map((entry) => {
        return {
          medicine: entry.medicine._id,
          time: entry.time,
        };
      });
    });

    let res = {
      month,
      details: formattedDetails,
    };

    if (
      await pTracker(
        logged.token,
        (message, severity) => {
          setAlert({ isOpen: true, message, severity });
        },
        patientID,
        res
      )
    ) {
      if (patientsAllTracker.find((t) => t.month == month)) {
        setPatientsAllTracker((ts) => {
          return ts.map((t) => {
            if (t.month === month) {
              return { month, details };
            } else {
              return t;
            }
          });
        });
      } else {
        setPatientsAllTracker((ts) => {
          return [...ts, { month, details }];
        });
      }
    }
  };

  const fn_setAvailableMonth = () => {
    let AMs = [];

    let d = dayjs().add(allowMonthsAhead, "M");
    while (
      d.isAfter(dayjs(TRACKER_START_MONTH, `MMMM YYYY`), "month") ||
      d.isSame(dayjs(TRACKER_START_MONTH, `MMMM YYYY`), "month")
    ) {
      AMs.push(d.format(`MMMM YYYY`));
      d = d.subtract(1, "M");
    }

    setAvailableMonths(AMs);
    return AMs;
  };

  /**
   *
   * @param {string} patientID
   * @returns {Array<{time, purchase:Array< medicine:{_id, medicineName, doze}, quantity >}>}
   */
  const getPur = async (patientID) => {
    return await getPurchases(
      logged.token,
      (message, severity) => {
        setAlert({ isOpen: true, message, severity });
      },
      patientID
    );
  };

  const verifyPurchases = (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].quantity <= 0) {
        return false;
      }
    }

    return true;
  };

  /**
   *
   * @param {*} patientID
   * @returns {Array<{medicine, quantity}>} medicine is the medicineID of the medicine,
   *                                        quantity is the quantity in pillcount
   */
  const getInventory = async (patientID) => {
    return await fetchInventory(
      logged.token,
      (message, severity) => {
        setAlert({ isOpen: true, message, severity });
      },
      patientID
    );
  };

  let addPatientPills = async (AM, wi) => {
    for (let i = 0; i < patients.length; i++) {
      let purchases = await getPur(patients[i]._id);
      wi.queryFunction(
        "noOfMedsUnavailable",
        AM, //available months
        patients[i]._id,
        patients[i].prescription,
        purchases
      );
    }
  };

  useEffect(() => {
    setMonth(dayjs().format(`MMMM YYYY`));
    let AM = fn_setAvailableMonth();
    let wi = new WebWorker("app.worker.js");

    wi.addListner("noOfMedsUnavailable", (data) => {
      let { patientID, count } = data;
      setPatientBadges((prevState) => {
        let fIdx = prevState.findIndex((obj) => {
          if (obj.patientID === patientID) {
            return true;
          } else {
            return false;
          }
        });

        if (fIdx === -1) {
          return [...prevState, { patientID, count }];
        } else {
          return prevState.map((val, idx) => {
            if (idx === fIdx) {
              return { patientID, count };
            } else {
              return val;
            }
          });
        }
      });
    });
    addPatientPills(AM, wi);
    setWorkerInstance(wi);

    return function () {
      if (workerInstance) workerInstance.terminate();
    };
  }, []);

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
      <div className="empty-bar"></div>
      <BasicTable
        headers={["Name", "Purchase", "View"]}
        rows={patients.map((patient, idx) => [
          <Badge
            badgeContent={
              patientBadges.find((p) => p.patientID === patient._id)?.count
            }
            color="error"
            max={999}
          >
            <Box sx={{ p: "0.5rem" }}>{patient.name}</Box>
          </Badge>,
          <>
            <FormDialog
              btnVariant="outlined"
              btnContent="Add Purchase"
              btnSx={{ fontSize: "0.7rem" }}
              title="Add Purchase"
              form={
                <AddPurchase
                  name={patient.name}
                  age={patient.age}
                  bmi={patient.bmi}
                  medicines={medicines}
                  prescription={patient.prescription}
                  formInput={formInputPurchase}
                  setFormInput={setFormInputPurchase}
                  purchaseDate={purchaseDate}
                  setPurchaseDate={setPurchaseDate}
                />
              }
              onOpen={() => {
                setFormInputPurchase([
                  { medicineName: "", quantity: "", doze: "" },
                ]);
              }}
              onClose={async (success) => {
                if (success && verifyPurchases(formInputPurchase)) {
                  let map = new Map();
                  for (let i = 0; i < medicines.length; i++) {
                    map.set(
                      `${medicines[i].medicineName} ${medicines[i].doze}`,
                      medicines[i]._id
                    );
                  }

                  let body = {
                    time: dayjs(purchaseDate, "D/M/YYYY").format(),
                    purchase: [],
                  };

                  for (let i = 0; i < formInputPurchase.length; i++) {
                    body.purchase.push({
                      medicine: map.get(
                        `${formInputPurchase[i].medicineName} ${formInputPurchase[i].doze}`
                      ),
                      quantity: formInputPurchase[i].quantity,
                    });
                  }

                  await postPurchase(
                    logged.token,
                    (message, severity) => {
                      setAlert({ isOpen: true, message, severity });
                    },
                    patient._id,
                    body
                  );
                } else if (success) {
                  setAlert({
                    isOpen: true,
                    message: "Quantity should be greater than 0 ",
                    severity: "error",
                  });
                }
              }}
            />
          </>,
          <>
            <FormDialog
              btnVariant="outlined"
              btnContent="Tracker"
              btnSx={{ fontSize: "0.7rem" }}
              title="Track Medicines"
              form={
                <TrackMedicine
                  patient={patient}
                  i={idx}
                  month={month}
                  setMonth={setMonth}
                  trackerTable={trackerTable}
                  setTrackerTable={setTrackerTable}
                  medicines={medicines}
                  fetchTracker={fetchTracker}
                  fetchAllTracker={fetchAllTracker}
                  patientsAllTracker={patientsAllTracker}
                  getInventory={getInventory}
                  addUpdateTracker={addUpdateTracker}
                  getPurchases={getPur}
                  availableMonths={availableMonths}
                  setAvailableMonths={setAvailableMonths}
                  allowMonthsAhead={allowMonthsAhead}
                />
              }
              onOpen={async () => {
                let allTracker = await fetchAllTracker(patient._id);
                setTrackerTable(fetchTracker(allTracker, patient._id, month));
              }}
              onClose={async (success) => {
                if (success) {
                  await addUpdateTracker(
                    patient._id,
                    month,
                    trackerTable.tracker
                  );
                }
              }}
            />
          </>,
        ])}
      />
    </>
  );
}
