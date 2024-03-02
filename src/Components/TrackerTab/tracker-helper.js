import dayjs from "dayjs";

/**
 *
 * @param {*} patients
 * @param {Number} month
 *                  month e.g "January"
 * @param {Number} year
 *                  e.g "2023"
 * @returns {Array<{medID,medicineName, doze, times:[[[Dayjs]]]}>}
 */

function MedicineTimings(patient, month, year) {
  let prescription = patient.prescription;
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
          continue;
        }

        if (
          dayjs(`${d}/${month}/${year}`, "D-MMMM-YYYY").isAfter(
            dayjs(ld, "D/M/YYYY")
          )
        ) {
          break;
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

export { MedicineTimings };
