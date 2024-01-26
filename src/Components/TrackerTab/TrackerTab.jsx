import "./tracker-tab.css";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import BasicTable from "../BasicTable/BasicTable";
import FormDialog from "../FormDialog/FormDialog";

import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import dayjs from "dayjs";
import { TRACKER_START_MONTH } from "../../config/config";

export default function TrackerTab({ medicines, patients }) {
  const fetchTracker = async (patientID, month) => {
    return {
      _id: patientID,
      name: "Name1 Surname",
      age: 43,
      bmi: 6,
      tracker: {
        month: month,
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
        ],
      },
    };

    return [
      {
        _id: 309458103,
        name: "Name1 Surname",
        age: 43,
        bmi: 6,
        tracker: {
          month: "January 2024",
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
            [][
              {
                Time: "Tue, 09 Jan 2024 17:00:19 GMT", //UTCTime(dateTimeObj),
                medicine: {
                  _id: 31353515,
                  medicineName: "Name123",
                  doze: "100mg",
                },
              }
            ],
            [
              {
                Time: "Tue, 08 Jan 2024 17:00:19 GMT", //UTCTime(dateTimeObj),
                medicine: {
                  _id: 31353515,
                  medicineName: "Name1235",
                  doze: "100mg",
                },
              },
            ],
            [
              {
                Time: "Tue, 07 Jan 2024 17:00:19 GMT", //UTCTime(dateTimeObj),
                medicine: {
                  _id: 31353515,
                  medicineName: "Name1234",
                  doze: "100mg",
                },
              },
            ],
            [],
            [
              {
                Time: "Tue, 05 Jan 2024 07:00:19 GMT", //UTCTime(dateTimeObj),
                medicine: {
                  _id: 31353515,
                  medicineName: "Name1234",
                  doze: "100mg",
                },
              },
            ],
            [],
            [],
            [],
            [],
          ],
        },
      },
    ];
  };

  useEffect(() => {
    async function fetchTrackerLastThreeMonths() {
      let patientID = patients._id;
      let lastThreeMonths = [];

      for (let i = 2; i <= 0; i--) {
        lastThreeMonths.push(
          `${dayjs()
            .subtract(i + 1, "months")
            .month()} ${dayjs()
            .subtract(i + 1, "month")
            .year()}`
        );
      }
      lastThreeMonths.push(`${dayjs().month()} ${dayjs().year()}`);

      let tracker = [];

      for (let i = 0; i < lastThreeMonths.length; i++) {
        tracker.push(await fetchTracker(patientID, lastThreeMonths[i]));
      }
    }

    fetchTrackerLastThreeMonths();
  }, []);

  const postTracker = async (patientID, duration, trackerObj) => {};

  useEffect(() => {
    setMonth(dayjs().format(`MMMM YYYY`));
  }, []);

  const [trackerTable, setTrackerTable] = useState([]);
  const [month, setMonth] = useState("January 2024");

  const [formInputPurchase, setFormInputPurchase] = useState([
    { medicineName: "", doze: "", quantity: 0 },
  ]);
  const [formInputTracker, setFormInputTracker] = useState([]);

  return (
    <>
      <div className="empty-bar"></div>
      <BasicTable
        headers={["Name", "Purchase", "View"]}
        rows={patients.map((patient, idx) => [
          patient.name,
          <>
            <FormDialog
              btnVariant="outlined"
              btnContent="Add Purchase"
              btnSx={{ fontSize: "0.7rem" }}
              title="Add Purchase"
              form={
                <AddPurchase
                  medicines={medicines}
                  formInput={formInputPurchase}
                  setFormInput={setFormInputPurchase}
                />
              }
              onOpen={() => {
                setFormInputPurchase([
                  { medicineName: "", quantity: "", doze: "" },
                ]);
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
                />
              }
              onOpen={async () => {
                setTrackerTable(await fetchTracker(patient._id, month));
              }}
              onClose={async () => {
                await postTracker(trackerTable);
              }}
            />
          </>,
        ])}
      />
    </>
  );
}

function AddPurchase({
  name = "",
  age = "",
  bmi = "",
  medicines,
  formInput,
  setFormInput,
}) {
  return (
    <div style={{ width: "55rem", maxWidth: "90vw" }}>
      <div className="prescription-bar">
        <div className="patient-details" style={{ width: "50%" }}>
          <div>
            {"Name:  "}
            {name}
          </div>
          <div>
            {"Age:   "}
            {age}
          </div>
          <div>
            {"BMI:   "}
            {bmi}
          </div>
        </div>
        <Button
          sx={{ px: "1rem", width: "7rem" }}
          variant="outlined"
          onClick={() => {
            setFormInput((prevState) => [
              ...prevState,
              { medicineName: "", doze: "", quantity: 0 },
            ]);
          }}
        >
          Add
        </Button>
      </div>
      <div className="medicines">
        {formInput.map((listItem, i) => {
          return (
            <ListItem
              key={listItem._id}
              medicines={medicines}
              listItem={listItem}
              i={i}
              setListItem={(newListItem) => {
                setFormInput(
                  formInput.map((v, idx) => {
                    if (idx === i) {
                      return newListItem;
                    } else {
                      return v;
                    }
                  })
                );
              }}
              removeListItem={() => {
                setFormInput(formInput.filter((v, idx) => i !== idx));
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function TrackMedicine({
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
}) {
  const [availableMonths, setAvailableMonths] = useState([
    "January 2024",
    "December 2023",
  ]);

  /**
   *[
       ["MedicineName1 / Doze", [Dayjs], [], [], [], [].... ],
       ["MedicineName2 / Doze", [Dayjs], [], [], [], [].... ],
   ]
   */
  const [MedTimings, setMedTimings] = useState([[]]);
  const [checkboxValue, setCheckBoxValue] = useState([[]]);

  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    function setDaysArr() {
      let res = [];

      let d = dayjs(month, "MMMM YYYY").daysInMonth();
      for (let i = 1; i <= d; i++) {
        res.push(i);
      }

      setDaysInMonth(res);
    }

    function setMedicineTimings() {
      let [m, y] = month.split(" ");

      /**
       * Array<{medicineName, doze, times:[DateObj]}
       */
      let MT = MedicineTimings(patient, m, y);
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
    }

    function setCheckBoxValue2() {}

    setDaysArr();
    setMedicineTimings();
  }, [month]);

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
    let medsArr = [];

    for (let i = 0; i < MedTimings.length; i++) {
      let medArr = [];
      for (let j = 1; j < MedTimings[0].length; j++) {
        medArr.push(checkboxFn(MedTimings[i][j], MedTimings[i][0].medID));
      }
      medsArr.push(medArr);
    }

    setCheckBoxValue(medsArr);
  }, [trackerTable]);

  function checkboxFn(date, medID) {
    let TT = trackerTable.tracker.details[date.date() - 1];

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

  function onCheckBoxChange(e, date, medID) {
    let checked = e.target.checked;
    let day = date.date();
    let TT = trackerTable.tracker.details[day - 1];
    let hasTheDate =
      TT.findIndex((val) => {
        return (
          dayjs(val.time).isSame(date, "minutes") && val.medicine._id === medID
        );
      }) !== -1;

    let medicine = medicines.find((med) => med._id === medID);

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
        prevState.tracker.details[day - 1].filter((val) => {
          return !(
            dayjs(val.time).isSame(date, "minutes") &&
            val.medicine._id === medID
          );
        });
        return prevState;
      });
    }
  }

  return (
    <>
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
                setMonth(e.target.value);
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
                  return `${obj.medicineName}, ${obj.doze}`;
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
                                  checked={checkboxValue[idx1][idx2 - 1]}
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

function ListItem({
  medicines = [],
  listItem,
  i,
  removeListItem = () => {},
  setListItem = () => {},
  viewOnly = false,
}) {
  const [editState, setEditState] = useState(false);
  const [listVal, setListVal] = useState([]);

  useEffect(() => {
    setListVal(listItem);
    if (listItem.medicineName === "" && listItem.doze === "") {
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
          <Typography>{listVal.medicineName}</Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 100 }}> {listVal.doze} </Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 100 }}> {listVal.quantity} </Typography>
        </div>
        {viewOnly === false ? (
          <div className="pres-btn-bar">
            <Button
              onClick={() => {
                removeListItem();
              }}
            >
              <DeleteRoundedIcon color="primary" />
            </Button>
            <Button
              onClick={() => {
                setEditState(true);
              }}
            >
              <EditRoundedIcon color="primary" />
            </Button>
          </div>
        ) : (
          <></>
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
              value={listVal.medicineName}
              onChange={(e) => {
                setListVal((prevState) => {
                  return {
                    ...prevState,
                    medicineName: e.target.value,
                    doze: "",
                    quantity: 0,
                  };
                });
              }}
            >
              <MenuItem key={"NONE"} value={""}>
                None
              </MenuItem>
              {medicines.map((med, idx1) => {
                return (
                  <MenuItem key={idx1} value={med.medicineName}>
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
              value={listVal.doze}
              onChange={(e) => {
                setListVal((prevState) => {
                  return { ...prevState, doze: e.target.value, quantity: 0 };
                });
              }}
            >
              <MenuItem key={"NONE"} value={""}>
                None
              </MenuItem>
              {medicines
                .filter((med) => med.medicineName === listVal.medicineName)
                .map((med, idx) => {
                  return (
                    <MenuItem key={idx} value={med.doze}>
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
          }}
        >
          <TextField
            variant="outlined"
            value={listVal.quantity}
            label="Quantity"
            onChange={(e) => {
              setListVal((prevState) => {
                return { ...prevState, quantity: e.target.value };
              });
            }}
          />
        </div>
        <div className="pres-btn-bar">
          <Button
            onClick={() => {
              removeListItem();
            }}
          >
            <DeleteRoundedIcon color="primary" />
          </Button>
          <Button
            onClick={() => {
              setListItem(listVal);
              setEditState(false);
            }}
          >
            <SaveRoundedIcon color="primary" />
          </Button>
        </div>
      </div>
    );
  }
}

/**
 *
 * @param {*} patients
 * @param {Number} month
 *                  month e.g "January"
 * @param {Number} year
 *                  e.g "2023"
 * @returns {Array<{medID,medicineName, doze, times:[[Dayjs]]}>}
 */

function MedicineTimings(patient, month, year) {
  let prescription = patient.prescription;
  let res = [];

  for (let i = 0; i < prescription.length; i++) {
    let format = prescription[i].times.format;

    if (format === "daily") {
      let times = [];
      let ds = dayjs(`${year}/${month}/1`, "YYYY/MMMM/D").daysInMonth();
      let timingsEachDay = prescription[i].times.repetations;

      for (let d = 1; d <= ds; d++) {
        let timesd = [];
        timingsEachDay.forEach((val) => {
          timesd.push(
            dayjs(`${d}/${month}/${year} ${val.time}`, "D-MMMM-YYYY H:m")
          );
        });
        times.push(timesd);
      }

      res.push({
        medID: prescription[i]._id,
        medicineName: prescription[i].medicineName,
        doze: prescription[i].doze,
        times,
      });
    }

    /**
     * example of repetation Obj=[[day:"Monday", time:"8:30"],[day:"Monday", time:"17:30"],[day:"Tuesday", time:"8:30"],[day:"Tuesday", time:"17:30"],]
     */
    if (format === "weekly") {
      let ds = dayjs(`${year}/${month}/1`, "YYYY/MMMM/D").daysInMonth();

      let times = [];

      for (let j = 0; j < ds; j++) {
        times.push([]);
      }

      let timingsEachWeek = prescription[i].times.repetations;

      for (let j = 0; j < timingsEachWeek.length; j++) {
        let dayNumber = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thusday: 4,
          friday: 5,
          saturday: 6,
        };

        let d = dayjs(`1/${month}/${year}`, `D/MMMM/YYYY`).day(
          dayNumber[timingsEachWeek[j].day]
        );

        if (d.isBefore(dayjs(`${year}/${month}/1`, "YYYY/MMMM/D"), "month")) {
          d = d.add(1, "week");
        }

        while (d.isSame(dayjs(`${year}/${month}/1`, "YYYY/MMMM/D"), "month")) {
          let date = d.date();

          times[date].push(
            dayjs(
              `${date}/${month}/${year} ${timingsEachWeek[j].time}`,
              `D/MMMM/YYYY H:m`
            )
          );

          d = d.add(1, "week");
        }
      }

      res.push({
        medID: prescription[i]._id,
        medicineName: prescription[i].medicineName,
        doze: prescription[i].doze,
        times,
      });
    }

    /**
     * example of repetation Obj = [{date:1, time:"8:30"},{date:3, time:"8:30"}, {date:5, time:"8:30"}]
     */

    if (format === "monthly") {
      let ds = dayjs(`${year}/${month}/1`, "YYYY/MMMM/D").daysInMonth();

      let times = [];
      for (let j = 0; j < ds; j++) {
        times.push([]);
      }

      let timingsEachMonth = prescription[i].times.repetations;

      for (let j = 0; j < timingsEachMonth.length; j++) {
        let date = timingsEachMonth[j].date;
        let t = timingsEachMonth[j].time;
        times[date].push(
          dayjs(`${year}/${month}/${date} ${t}`, "YYYY/MMMM/D H:m")
        );
      }

      res.push({
        medID: prescription[i]._id,
        medicineName: prescription[i].medicineName,
        doze: prescription[i].doze,
        times,
      });
    }

    /**
      times: {
              format: "alternate-day",
              firstDay: "1/1/2024",
              repetations: [{ time: "12:00" }, { time: "17:00" }],
            },
     */

    if (format === "alternate-day") {
      let ds = dayjs(`${year}/${month}/1`, "YYYY/MMMM/D").daysInMonth();
      let firstDay = prescription[i].times.firstDay;
      let d = dayjs(firstDay, `D/M/YYYY`);

      if (d.isAfter(dayjs(`${year}/${month}/1`, "YYYY/MMMM/D"), "month")) {
        res.push({
          medID: prescription[i]._id,
          medicineName: prescription[i].medicineName,
          doze: prescription[i].doze,
          times: [[]],
        });
      }

      while (!d.isSame(dayjs(`${year}/${month}/1`, "YYYY/MMMM/D"), "month")) {
        d = d.add(2, "day");
      }

      let times = [];
      for (let i = 0; i < ds; i++) {
        times.push([]);
      }

      while (d.isSame(dayjs(`${year}/${month}/1`, "YYYY/MMMM/D"), "month")) {
        let date = d.date() - 1;

        let r = prescription[i].times.repetations;
        r.forEach((val) => {
          let [h, m] = val.time.split(":").map((val1) => parseInt(val1));
          times[date].push(dayjs(d).minute(m).hour(h));
        });

        d = d.add(2, "day");
      }

      res.push({
        medID: prescription[i]._id,
        medicineName: prescription[i].medicineName,
        doze: prescription[i].doze,
        times,
      });
    }
  }

  return res;
}
