import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { MedicineTimings } from "./tracker-helper";
import {
  DAYS_OF_MEDICINE_TO_BE_KEPT_IN_STOCK,
  MIN_MED_QUANTITY,
  TRACKER_START_MONTH,
} from "../../config/config";

import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Badge,
} from "@mui/material";

import BasicTable from "../BasicTable/BasicTable";
import FormDialogWithoutBtn from "../FormDialog/FormDialogWithoutBtn";

export default function TrackMedicine({
  name = "",
  age = "",
  bmi = "",
  i,
  patient,
  month,
  setMonth,
  trackerTable,
  setTrackerTable,
  medicines,
  fetchTracker,
  fetchAllTracker,
  patientsAllTracker,
  getInventory,
  addUpdateTracker,
}) {
  const [availableMonths, setAvailableMonths] = useState([
    "January 2024",
    "December 2023",
  ]);

  const [diaBoxOpen, setDiaBoxOpen] = useState(false);
  const [newMonth, setNewMonth] = useState("");

  /**
     *[
         ["MedicineName1 / Doze", [Dayjs], [], [], [], [].... ],
         ["MedicineName2 / Doze", [Dayjs], [], [], [], [].... ],
      ]
     */
  const [MedTimings, setMedTimings] = useState([[]]);
  const [checkboxValue, setCheckBoxValue] = useState([[]]);
  const [medAlertPills, setMedAlertPills] = useState([]);

  const [daysInMonth, setDaysInMonth] = useState([]);

  function setDaysArr() {
    let res = [];

    let d = dayjs(month, "MMMM YYYY").daysInMonth();
    for (let i = 1; i <= d; i++) {
      res.push(i);
    }

    setDaysInMonth(res);
  }

  /**
   * Sets the medTimings to the following structure
   *
   * [
   *    [{medicineName, doze, medID}, [dayJs], [dayjs], [dayjs],......(31/32 length) ]
   *    [{medicineName, doze, medID}, [dayJs], [dayjs], [dayjs],......(31/32 length) ]
   *    .
   *    .
   *    .
   * ]
   *
   *
   */
  function setMedicineTimings() {
    let [m, y] = month.split(" ");

    /**
     * Array<{medicineName, doze, times:[[DateObj]]}
     */
    let MT = MedicineTimings(patient, m, y);
    // console.log(`Value of MT = `);
    // console.log(MT);
    let res = [];
    MT.forEach((med) => {
      let arr = [
        { medicineName: med.medicineName, medID: med.medID, doze: med.doze },
      ];

      for (let i = 0; i < med.times.length; i++) {
        arr.push(med.times[i]);
      }

      res.push(arr);
    });
    setMedTimings(res);
    return res;
  }

  function setCheckBoxValueFn(MedTimings, trackerTable) {
    let medsArr = [];

    for (let i = 0; i < MedTimings.length; i++) {
      let medArr = [];
      for (let j = 1; j < MedTimings[i].length; j++) {
        let dayArr = [];
        for (let k = 0; k < MedTimings[i][j].length; k++) {
          dayArr.push(
            checkboxFn(
              MedTimings[i][j][k],
              MedTimings[i][0].medID,
              trackerTable
            )
          );
          // dayArr.push(false);
        }
        medArr.push(dayArr.slice());
      }
      medsArr.push(medArr);
    }

    setCheckBoxValue(medsArr);
    return medsArr;
  }

  function checkboxFn(date, medID, trackerTable) {
    // console.log(trackerTable);
    // return false;
    let TT = trackerTable.tracker.details[date.date() - 1];

    if (!TT) {
      // throw new Error(
      //   ` trackerTable.tracker.details[date.date() - 1] = ${TT} date = ${date.date()}`
      // );
      console.log(`trackerTable.tracker.details[date.date() - 1] is ${TT}`);
      return false;
    }

    if (
      TT.findIndex((val) => {
        return (
          dayjs(val.time).isSame(date, "minutes") && val.medicine._id === medID
        );
      }) !== -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  async function setMedPillValFn(MT, checkboxValue) {
    let inv = await getInventory(patient._id);
    let medIDarr = MT.map((val) => {
      if (val[0].medID) return val[0].medID;
      else {
        throw new Error(
          "The MedicineTiming State variables mapping to arr of MedIDs failed"
        );
      }
    });
    let res = [];
    for (let i = 0; i < checkboxValue.length; i++) {
      let medID = medIDarr[i];

      let med = inv.find((m) => {
        return m.medicine.toString() == medID;
      });

      if (med === undefined) {
        res.push(`No Purchase`);
        continue;
      } else if (med.quantity < MIN_MED_QUANTITY) {
        res.push(`${med?.quantity} left`);
        continue;
      }
      //TODO Add min days of medicine required  alert badge
      res.push("");
    }
    setMedAlertPills(res);
    return res;
  }

  const setUp = () => {
    setDaysArr();

    let trackerTable = fetchTracker(patientsAllTracker, patient._id, month);

    setTrackerTable(trackerTable);
    let MT = setMedicineTimings();
    let cbv = setCheckBoxValueFn(MT, trackerTable);
    let [m, y] = month.split(" ");

    //Setting pill values
    if (dayjs().isSame(dayjs(`1/${m}/${y}`, "D/MMMM/YYYY"), "month")) {
      setMedPillValFn(MT, cbv);
    } else {
      let res = [];
      for (let i = 0; i < MT.length; i++) {
        res.push("");
      }
      setMedAlertPills(res);
    }
  };

  useEffect(() => {
    let AMs = [];

    let d = dayjs();
    while (
      d.isAfter(dayjs(TRACKER_START_MONTH, `MMMM YYYY`), "month") ||
      d.isSame(dayjs(TRACKER_START_MONTH, `MMMM YYYY`), "month")
    ) {
      AMs.push(d.format(`MMMM YYYY`));
      d = d.subtract(1, "M");
    }

    setAvailableMonths(AMs);
  }, []);

  useEffect(() => {
    setUp();
    // console.log(`Month changed to ${month}`);
  }, [month]);

  useEffect(() => {
    let MT = setMedicineTimings();
    setCheckBoxValueFn(MT, trackerTable);
  }, [trackerTable.tracker.details, trackerTable]);

  /**
   * The function checks for match of date and medicine in tracker table
   * @param {*} date
   * @param {*} medID
   * @returns
   */

  function onCheckBoxChange(e, date, medID) {
    // console.log("medID= ");
    // console.log(medID);

    let checked = e.target.checked;
    let day = date.date();
    let TT = trackerTable.tracker.details[day - 1];
    // console.log(`TT =`);
    // console.log(TT);
    let hasTheDate =
      TT.findIndex((val) => {
        return (
          dayjs(val.time).isSame(date, "minutes") && val.medicine._id == medID
        );
      }) !== -1;
    // console.log(`hasTheDate = `);
    // console.log(hasTheDate);
    let medicine = medicines.find((med) => med._id.toString() == medID);
    // console.log(`medicine = `);
    // console.log(medicine);
    // console.log(medicine._id);

    if (checked === true && hasTheDate !== true) {
      setTrackerTable((prevState) => {
        prevState.tracker.details[day - 1].push({
          time: date.format(),
          medicine,
        });
        return prevState;
      });
    }

    if (checked !== true && hasTheDate === true) {
      setTrackerTable((prevState) => {
        prevState.tracker.details[day - 1] = prevState.tracker.details[
          day - 1
        ].filter((val) => {
          return !(
            dayjs(val.time).isSame(date, "minutes") &&
            val.medicine._id === medID
          );
        });
        return prevState;
      });
    }

    let MT = setMedicineTimings();
    setCheckBoxValueFn(MT, trackerTable);
  }

  return (
    <>
      <FormDialogWithoutBtn
        open={diaBoxOpen}
        setOpen={setDiaBoxOpen}
        title="Confim Action"
        content=""
        form={
          <Typography sx={{ fontWeight: 300 }}>
            Do you want to save the changes for the {month} and change month?
          </Typography>
        }
        replaceCancelWith="No"
        onClose={async (success) => {
          if (success) {
            await addUpdateTracker(patient._id, month, trackerTable.tracker);
            setMonth(newMonth);
          } else {
            setMonth(newMonth);
          }
        }}
      />
      <div style={{ width: "55rem", maxWidth: "90vw" }}>
        <div className="tracker-details-bar">
          <div>Name: {patient.name}</div>
          <div>Age: {patient.age}</div>
          <div>BMI: {patient.bmi}</div>
        </div>
        <div className="tracker-month-bar">
          <FormControl sx={{ width: "20rem" }}>
            <InputLabel id={`label${i}1`}>Month</InputLabel>
            <Select
              sx={{ width: "100%", color: "grey" }}
              labelId={`label${i}1`}
              label="Month"
              value={month}
              onChange={(e) => {
                setNewMonth(e.target.value);
                setDiaBoxOpen(true);
              }}
            >
              <MenuItem key={"NONE"} value={""}>
                None
              </MenuItem>
              {availableMonths.map((mon, idx1) => {
                return (
                  <MenuItem key={idx1} value={mon}>
                    {mon}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="tracker-details">
          <BasicTable
            headers={["Medicine/Doze", ...daysInMonth]}
            rows={MedTimings.map((row, idx1) => {
              return row.map((obj, idx2) => {
                if (idx2 === 0) {
                  return (
                    <>
                      {medAlertPills[idx1] !== "" ? (
                        <Badge
                          color="secondary"
                          badgeContent={medAlertPills[idx1]}
                        >
                          <Typography>
                            {`${obj.medicineName}, ${obj.doze}`}
                          </Typography>
                        </Badge>
                      ) : (
                        <Typography>
                          {`${obj.medicineName}, ${obj.doze}`}
                        </Typography>
                      )}
                    </>
                  );
                } else {
                  return (
                    <div
                      className="tracker-day-cell"
                      // style={{ height: `${1.5 * obj.length}rem` }}
                    >
                      <FormGroup>
                        {obj.map((t, i) => {
                          return (
                            <FormControlLabel
                              key={i}
                              control={
                                <Checkbox
                                  checked={checkboxValue[idx1][idx2 - 1][i]}
                                  onChange={(e) => {
                                    onCheckBoxChange(e, t, row[0].medID);
                                  }}
                                  size="small"
                                />
                              }
                              label={dayjs(t).format(`hh:mm a`)}
                              componentsProps={{
                                typography: {
                                  fontSize: "0.75rem !important",
                                  fontWeight: 300,
                                  width: "4rem",
                                },
                              }}
                              disabled={dayjs(t).isAfter(dayjs(), "day")}
                            />
                          );
                        })}
                      </FormGroup>
                    </div>
                  );
                }
              });
            })}
          />
        </div>
      </div>
    </>
  );
}
