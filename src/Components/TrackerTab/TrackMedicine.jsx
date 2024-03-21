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
  getPurchases,
}) {
  const [availableMonths, setAvailableMonths] = useState([
    "January 2024",
    "December 2023",
  ]);
  const [allowMonthsAhead, setAllowMonthsAhead] = useState(6);
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
  const [checkboxProps, setCheckboxProps] = useState([]);
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

  function setMedicineTimingsAllMonths() {
    let allMonthRes = [];
    availableMonths.forEach((month) => {
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
      allMonthRes.push({ month, MedicineTimings: res });
    });

    return allMonthRes;
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

  const setUp2 = async (availableMonths) => {
    /**
     * @returns {[dayjs, dayjs]} [firstDay, lastDay]
     */
    const getFirstNLastDay = (medID) => {
      let presc = patient.prescription.find((v) => v.medID === medID);

      if (!presc) {
        throw new Error(`prescription of the medID=${medID} not found`);
      }

      return [
        dayjs(presc.times.firstDay, "D/M/YYYY"),
        dayjs(presc.times.lastDay, "D/M/YYYY"),
      ];
    };

    /**
     *
     * @param { Array } purchases
     * @param { number } purchaseIdx
     * @param { string } medID
     * @returns { Array(2) } [time:dayjs, qty]
     */
    function nextPurchase(purchases, purchaseIdx, medID) {
      while (purchaseIdx.i < purchases.length) {
        let purArr = purchases[purchaseIdx.i];
        console.log(purArr);
        let purObj = purArr.purchase.find((v) => v.medicine._id === medID);

        if (purObj !== undefined) {
          return [dayjs(purArr.time), purObj.quantity];
        } else {
          purchaseIdx.i++;
          continue;
        }
      }
      return null;
    }

    /**
     * @description changes the props to disabled timeFrom included( checks by minute ) to timeTo(check by Day) excluded
     *
     * @param {dayjs} timeFrom
     * @param {dayjs} timeTo
     * @param {string} medID
     * @param {*} checkboxProps
     * @returns
     */
    function markAsDisabled(timeFrom, timeTo, medID, checkboxProps) {
      let month = timeFrom.format("MMMM YYYY");
      let lastmonthIdx = 0;

      let allMarked = false;

      let monthObj = checkboxProps.find((obj, idx1) => {
        if (obj.month === month) {
          lastmonthIdx = idx1;
          return true;
        }
        return false;
      });
      if (!monthObj) {
        return null;
      }
      while (true) {
        let ts = monthObj.ckBxProps.find((v) => v.medID === medID);
        if (!ts) {
          return null;
        }

        ts = ts.times;

        for (let i = 0; i < ts.length; i++) {
          if (allMarked) break;
          for (let j = 0; j < ts[i].length; j++) {
            if (ts[i][j].date.isAfter(timeTo, "D")) {
              allMarked = true;
              break;
            } else if (
              ts[i][j].date.isAfter(timeFrom, "m") ||
              ts[i][j].date.isSame(timeFrom, "m")
            ) {
              ts[i][j].disabled = true;
            } else {
              continue;
            }
          }
        }

        if (allMarked) break;
        lastmonthIdx++;
        monthObj = checkboxProps[lastmonthIdx];
        if (!monthObj) {
          return null;
        }
      }
      return true;
    }

    /**
     *
     * @param {*} MT_ALL_MONTHS
     * @returns {Array<medID>}
     */
    function getAllMedID(MT_ALL_MONTHS) {
      // let medIdSet = new Set();

      // for(let i=0;i<MT_ALL_MONTHS.length;i++){
      //   for(let j=0;j<MT_ALL_MONTHS[i].medicineTimings.length;j++){
      //     if(!medIdSet.has(MT_ALL_MONTHS[i].medicineTimings[j].medID)){

      //       medIdSet.add( MT_ALL_MONTHS[i].medicineTimings[j].medID );

      //     }
      //   }
      // }

      // return Array.from(medIdSet);

      let pres = patient.prescription;

      let medIDArr = [];

      pres.forEach((val) => {
        medIDArr.push(val.medID);
      });

      return medIDArr;
    }

    /**
     *
     * @param {*} checkboxProps
     * @param {*} timeFrom
     * @param {*} LDMA
     * @param {*} quantity_of_purchase
     * @returns { number } quanity of available medicine
     */
    function updateCheckboxProps(
      checkboxProps,
      medID,
      timeFrom,
      LDMA,
      quantity_of_purchase,
      lastDay
    ) {
      let mon = timeFrom.format("MMMM YYYY");

      while (true) {
        let a = checkboxProps.find((val) => val.month === mon);
        if (a === undefined) {
          return null;
        }
        let b = a.ckBxProps.find((v) => v.medID === medID);
        if (b === undefined) {
          return null;
        }
        let ts = b.times;
        let inventory_depleted = false;
        let iter_completed = false;
        for (let i = timeFrom.date() - 1; i < ts.length; i++) {
          if (inventory_depleted || iter_completed) break;
          for (let j = 0; j < ts[i].length; j++) {
            if (ts[i][j].date.isBefore(timeFrom, "minute")) {
              continue;
            }
            if (
              lastDay.isBefore(dayjs(`${i + 1} ${mon}`, "D MMMM YYYY"), "D")
            ) {
              iter_completed = true;
              LDMA.completed = true;
              break;
            }

            if (quantity_of_purchase <= 0) {
              inventory_depleted = true;
              LDMA.time = ts[i][j].date;
              break;
            }
            quantity_of_purchase--;
          }
        }
        if (inventory_depleted) {
          return 0;
        } else if (iter_completed) {
          return quantity_of_purchase;
        } else {
          mon = timeFrom.add(1, "month").format("MMMM YYYY");
        }
      }
    }

    let purchases = await getPurchases(patient._id);
    console.log(`Purchases length: ${purchases.length}`);

    purchases.sort((a, b) => {
      if (dayjs(a.time).isBefore(dayjs(b.time))) {
        return -1;
      } else if (dayjs(a.time).isAfter(dayjs(b.time))) {
        return 1;
      } else {
        return 0;
      }
    });
    let MT_ALL_MONTHS = [];

    let checkboxProps = [];

    // creating an empty dataStructure __> checkboxProps
    /**
     * [
     *  {
     *    month,
     *    ckBxProps: [
     *      medID:"objectID"
     *      times:[[{date, description, noMedicineFlag, disabled }],[],[]]
     *    ]
     *  }
     * ]
     */

    availableMonths.forEach((month) => {
      let [m, y] = month.split(" ");
      let MT = MedicineTimings(patient, m, y);
      MT_ALL_MONTHS.push({ month, medicineTimings: MT });
      let checkboxPropsInner = [];
      MT.forEach((v) => {
        let ckbkval = { medID: v.medID };
        let ts = v.times;

        let tsNew = [];
        for (let i = 0; i < ts.length; i++) {
          let innerTs = [];
          for (let j = 0; j < ts[i].length; j++) {
            innerTs.push({ date: ts[i][j] });
          }
          tsNew.push(innerTs);
        }

        ckbkval.times = tsNew;
        checkboxPropsInner.push(ckbkval);
      });
      checkboxProps.push({ month, ckBxProps: checkboxPropsInner });
    });

    //Reversing the arrays of MTs to get chronological order of MT in earliest --> latest
    MT_ALL_MONTHS.reverse();

    /**
     * [
     *    {
     *      time:dayjs,
     *      medID
     *    }
     * ]
     */

    let purchaseIdx = { i: 0 },
      date_of_purchase;

    let medIDArr = getAllMedID(MT_ALL_MONTHS);
    for (let i = 0; i < medIDArr.length; i++) {
      let medID = medIDArr[i];
      purchaseIdx = { i: 0 };
      let [firstDay, lastDay] = getFirstNLastDay(medID);
      let currDay = firstDay;
      let quantity_of_purchase;
      /**
       * {time:dayjs}
       */
      let LDMA = {};

      //PURCHASE LOOP
      while (true) {
        debugger;
        let nxPur = nextPurchase(purchases, purchaseIdx, medID);
        purchaseIdx.i++;
        if (nxPur !== null) {
          [date_of_purchase, quantity_of_purchase] = nxPur;

          if (!!LDMA?.time) {
            if (date_of_purchase.isAfter(LDMA.time, "D")) {
              markAsDisabled(LDMA.time, date_of_purchase, medID, checkboxProps);
              currDay = date_of_purchase.hour(0).minute(0);
            } else {
              currDay = LDMA.time;
            }
          } else {
            if (date_of_purchase.isAfter(firstDay, "D")) {
              markAsDisabled(firstDay, date_of_purchase, medID, checkboxProps);
              currDay = date_of_purchase;
            } else {
              currDay = firstDay;
            }
          }
        } else {
          if (LDMA?.time) {
            markAsDisabled(
              LDMA.time,
              lastDay.add(1, "D"),
              medID,
              checkboxProps
            );
          } else if (LDMA?.completed === undefined) {
            let endDate = lastDay.add(1, "D");
            markAsDisabled(firstDay, endDate, medID, checkboxProps);
          }
          break;
        }

        let q_left = updateCheckboxProps(
          checkboxProps,
          medID,
          currDay,
          LDMA,
          quantity_of_purchase,
          lastDay
        );
      }
    }
    setCheckboxProps(checkboxProps);
    console.log(checkboxProps);
  };

  const setUp = async () => {
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

  useEffect(() => {
    let AMs = fn_setAvailableMonth();
    // setUp2(AMs);
  }, []);

  useEffect(() => {
    fn_setAvailableMonth();
  }, [allowMonthsAhead]);

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
