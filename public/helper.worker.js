/*global dayjs, importScripts, dayjs_plugin_customParseFormat*/
importScripts(
  "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js",
  "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"
);

dayjs.extend(dayjs_plugin_customParseFormat);

function MedicineTimings2(prescription, month, year) {
  let res = [];

  for (let i = 0; i < prescription.length; i++) {
    let format = prescription[i].times.format;
    let fd = prescription[i].times.firstDay;
    let ld = prescription[i].times.lastDay;

    if (format === "daily") {
      let times = [];
      let ds = dayjs(`${year}/${month}/1`, "YYYY/MMMM/D").daysInMonth();
      let timingsEachDay = prescription[i].times.repetations;

      for (let d = 1; d <= ds; d++) {
        let timesd = [];

        if (
          dayjs(`${d}/${month}/${year}`, "D-MMMM-YYYY").isBefore(
            dayjs(fd, "D/M/YYYY")
          )
        ) {
          times.push([]);
          continue;
        }

        if (
          dayjs(`${d}/${month}/${year}`, "D-MMMM-YYYY").isAfter(
            dayjs(ld, "D/M/YYYY")
          )
        ) {
          times.push([]);
          continue;
        }

        timingsEachDay.forEach((val) => {
          timesd.push(
            dayjs(`${d}/${month}/${year} ${val.time}`, "D-MMMM-YYYY H:m")
          );
        });
        times.push(timesd);
      }

      res.push({
        medID: prescription[i].medID,
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
          if (d.isBefore(dayjs(fd, "D/M/YYYY"))) {
            d = d.add(1, "week");
            continue;
          }

          if (d.isAfter(dayjs(ld, "D/M/YYYY"))) {
            break;
          }

          let date = d.date() - 1;

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
        medID: prescription[i].medID,
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
        let date = timingsEachMonth[j].date - 1;
        let t = timingsEachMonth[j].time;

        if (
          dayjs(`${date + 1}/${month}/${year}`, "D/MMMM/YYYY").isBefore(
            dayjs(fd, "D/M/YYYY")
          )
        ) {
          continue;
        }

        if (
          dayjs(`${date + 1}/${month}/${year}`, "D/MMMM/YYYY").isAfter(
            dayjs(ld, "D/M/YYYY")
          )
        ) {
          break;
        }

        if (date < ds) {
          times[date].push(
            dayjs(`${year}/${month}/${date} ${t}`, "YYYY/MMMM/D H:m")
          );
        }
      }

      res.push({
        medID: prescription[i].medID,
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
          medID: prescription[i].medID,
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

        if (d.isAfter(dayjs(ld, "D/M/YYYY"))) {
          break;
        }

        let r = prescription[i].times.repetations;
        r.forEach((val) => {
          let [h, m] = val.time.split(":").map((val1) => parseInt(val1));
          times[date].push(dayjs(d).minute(m).hour(h));
        });

        d = d.add(2, "day");
      }

      res.push({
        medID: prescription[i].medID,
        medicineName: prescription[i].medicineName,
        doze: prescription[i].doze,
        times,
      });
    }
  }

  return res;
}

const findNumberOfMedicineUnavailable = (
  availableMonths,
  prescription,
  purchases
) => {
  /**
   * @returns {[dayjs, dayjs]} [firstDay, lastDay]
   */
  const getFirstNLastDay = (medID) => {
    let presc = prescription.find((v) => v.medID === medID);

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
  function markAsDisabled(timeFrom, timeTo, medID, checkboxProps, LDMA) {
    let month = timeFrom.format("MMMM YYYY");
    let lastmonthIdx = 0;
    let max_no_of_months = 12 * 20;
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
    while (max_no_of_months--) {
      let ts = monthObj.ckBxProps.find((v) => v.medID === medID);
      if (!ts) {
        return null;
      }

      ts = ts.times;

      for (let i = 0; i < ts.length; i++) {
        if (allMarked) break;
        for (let j = 0; j < ts[i].length; j++) {
          if (timeFrom.isSame(timeTo, "D")) {
            if (
              ts[i][j].date.isAfter(timeFrom, "m") ||
              ts[i][j].date.isSame(timeFrom, "m")
            ) {
              ts[i][j].disabled = true;
            }
          }
          if (
            ts[i][j].date.isAfter(timeTo, "D") ||
            ts[i][j].date.isSame(timeTo, "D")
          ) {
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
      lastmonthIdx--;
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
  function getAllMedID() {
    let pres = prescription;

    let medIDArr = [];

    pres.forEach((val) => {
      medIDArr.push(val.medID);
    });

    return medIDArr;
  }

  /**
   *
   * @param {dayjs} time
   * @param {object} checkboxProps
   * @param {string} medID
   * @returns {dayjs} nextTiming
   *
   */
  function nextTime(time, checkboxProps, medID) {
    let nxtime = null;
    let idx1 = 0;
    while (nxtime === null) {
      let mon = time.add(idx1++, "month").format("MMMM YYYY");

      let checkboxPropsMonth = checkboxProps.find((val) => val.month === mon);
      if (checkboxPropsMonth === undefined) {
        return time.add(1, "minute");
      }
      let ts = checkboxPropsMonth.ckBxProps.find((val) => val.medID === medID);
      ts = ts.times;
      let found = false;
      for (let i = 0; i < ts.length; i++) {
        if (found) break;
        for (let j = 0; j < ts[i].length; j++) {
          if (found) break;
          if (ts[i][j].date.isAfter(time, "minute")) {
            nxtime = ts[i][j].date;
            found = true;
          }
        }
      }
    }

    return nxtime;
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
    let max_no_of_months = 12 * 20;
    let lastMedTime = null;
    while (max_no_of_months--) {
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
      for (let i = 0; i < ts.length; i++) {
        if (inventory_depleted || iter_completed) break;

        if (lastDay.isBefore(dayjs(`${i + 1} ${mon}`, "D MMMM YYYY"), "D")) {
          iter_completed = true;
          LDMA.completed = true;
          break;
        }

        for (let j = 0; j < ts[i].length; j++) {
          lastMedTime = ts[i][j].date;
          if (ts[i][j].date.isBefore(timeFrom, "minute")) {
            continue;
          }
          if (lastDay.isBefore(dayjs(`${i + 1} ${mon}`, "D MMMM YYYY"), "D")) {
            LDMA.time = ts[i][j].date;
            iter_completed = true;
            LDMA.completed = true;
            break;
          }

          quantity_of_purchase--;

          if (quantity_of_purchase <= 0) {
            inventory_depleted = true;
            LDMA.time = nextTime(ts[i][j].date, checkboxProps, medID);
            break;
          }
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
    if (lastMedTime) LDMA.time = lastMedTime.add(1, "minute");
  }

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
    let MT = MedicineTimings2(prescription, m, y);
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

  let purchaseIdx = { i: 0 },
    date_of_purchase;

  let medIDArr = getAllMedID();
  for (let i = 0; i < medIDArr.length; i++) {
    let medID = medIDArr[i];
    purchaseIdx = { i: 0 };
    let [firstDay, lastDay] = getFirstNLastDay(medID);
    let currDay = firstDay;
    let quantity_of_purchase;
    let max_no_of_purchases = 1000;

    /**
     * {time:dayjs}
     */
    let LDMA = {};

    //PURCHASE LOOP
    while (max_no_of_purchases--) {
      let nxPur = nextPurchase(purchases, purchaseIdx, medID);
      purchaseIdx.i++;
      if (nxPur !== null) {
        [date_of_purchase, quantity_of_purchase] = nxPur;

        if (!!LDMA?.time) {
          if (date_of_purchase.isAfter(LDMA.time, "D")) {
            markAsDisabled(
              LDMA.time,
              date_of_purchase,
              medID,
              checkboxProps,
              LDMA
            );
            currDay = date_of_purchase.hour(0).minute(0);
          } else {
            currDay = LDMA.time;
          }
        } else {
          if (date_of_purchase.isAfter(firstDay, "D")) {
            markAsDisabled(
              firstDay,
              date_of_purchase,
              medID,
              checkboxProps,
              LDMA
            );
            currDay = date_of_purchase;
          } else {
            currDay = firstDay;
          }
        }
      } else {
        if (LDMA?.time) {
          markAsDisabled(
            LDMA.time,
            lastDay.add(1, "d"),
            medID,
            checkboxProps,
            LDMA
          );
        } else if (LDMA?.completed === undefined) {
          let endDate = lastDay.add(1, "d");
          dayjs();
          markAsDisabled(firstDay, endDate, medID, checkboxProps, LDMA);
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
  return medicinesUnavailable(checkboxProps);
};

function medicinesUnavailable(checkboxProps) {
  let count = 0;
  checkboxProps.forEach((val1) => {
    val1.ckBxProps.forEach((val2) => {
      let times = val2.times;

      for (let i = 0; i < times.length; i++) {
        for (let j = 0; j < times[i].length; j++) {
          if (
            times[i][j].hasOwnProperty("disabled") &&
            !times[i][j].date.isBefore(dayjs(), "date")
          ) {
            count++;
          }
        }
      }
    });
  });

  return count;
}
