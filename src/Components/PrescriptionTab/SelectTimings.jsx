import {
  Button,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import dayjs from "dayjs";

export default function SelectTimings({ times, setTimes, viewOnly = false }) {
  return (
    <Box className="timings">
      <Container sx={{ p: "1rem" }} className="timing-select-format">
        <FormControl fullWidth>
          <InputLabel id="timing-select-format">Format</InputLabel>
          <Select
            labelId="timing-select-format"
            id="demo-simple-select"
            value={times.format}
            label="Format"
            onChange={(e) => {
              if (!viewOnly)
                setTimes({
                  firstDay: times.firstDay,
                  lastDay: times.lastDay,
                  format: e.target.value,
                });
            }}
            disabled={viewOnly}
          >
            <MenuItem value={"daily"}>Daily</MenuItem>
            <MenuItem value={"weekly"}>Weekly</MenuItem>
            <MenuItem value={"monthly"}>Monthly</MenuItem>
            {/* <MenuItem value={"alternate-day"}>Alternate Day</MenuItem> */}
          </Select>
        </FormControl>

        {times.format === "daily" ? (
          <SelectDailyTimings
            repetations={times.repetations}
            setRepeations={(r) => {
              setTimes({ ...times, repetations: r });
            }}
            firstDay={times.firstDay}
            setFirstDay={(fd) => {
              setTimes({ ...times, firstDay: fd });
            }}
            lastDay={times.lastDay}
            setLastDay={(ld) => {
              setTimes({ ...times, lastDay: ld });
            }}
            viewOnly={viewOnly}
          />
        ) : times.format === "weekly" ? (
          <SelectWeeklyTimings
            repetations={times.repetations}
            setRepeations={(r) => {
              setTimes({ ...times, repetations: r });
            }}
            firstDay={times.firstDay}
            setFirstDay={(fd) => {
              setTimes({ ...times, firstDay: fd });
            }}
            lastDay={times.lastDay}
            setLastDay={(ld) => {
              setTimes({ ...times, lastDay: ld });
            }}
            viewOnly={viewOnly}
          />
        ) : times.format === "monthly" ? (
          <SelectMonthlyTimings
            repetations={times.repetations}
            setRepeations={(r) => {
              setTimes({ ...times, repetations: r });
            }}
            firstDay={times.firstDay}
            setFirstDay={(fd) => {
              setTimes({ ...times, firstDay: fd });
            }}
            lastDay={times.lastDay}
            setLastDay={(ld) => {
              setTimes({ ...times, lastDay: ld });
            }}
            viewOnly={viewOnly}
          />
        ) : times.format === "alternate-day" ? (
          <SelectAlternateDayTimings
            repetations={times.repetations}
            setRepeations={(r) => {
              setTimes({ ...times, repetations: r });
            }}
            firstDay={times.firstDay}
            setFirstDay={(fd) => {
              setTimes({ ...times, firstDay: fd });
            }}
            lastDay={times.lastDay}
            setLastDay={(ld) => {
              setTimes({ ...times, lastDay: ld });
            }}
            viewOnly={viewOnly}
          />
        ) : (
          <></>
        )}
      </Container>
    </Box>
  );
}

function SelectDailyTimings({
  repetations,
  setRepeations,
  viewOnly,
  firstDay,
  setFirstDay,
  lastDay,
  setLastDay,
}) {
  return (
    <>
      <Container
        sx={{
          p: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container sx={{ p: "0", pr: "1rem", width: "100%" }}>
            <DatePicker
              format="DD/MMM/YYYY"
              fullWidth
              sx={{ width: "100%" }}
              label="Starting Date"
              value={dayjs(firstDay, "D/M/YYYY")}
              onChange={(newValue) => {
                setFirstDay(newValue.format(`D/M/YYYY`));
              }}
              disabled={viewOnly}
            />
          </Container>
          <Container sx={{ p: "0", pr: "1rem", width: "100%" }}>
            <DatePicker
              format="DD/MMM/YYYY"
              fullWidth
              sx={{ width: "100%" }}
              label="End Date"
              value={dayjs(lastDay, "D/M/YYYY")}
              onChange={(newValue) => {
                setLastDay(newValue.format(`D/M/YYYY`));
              }}
              disabled={viewOnly}
            />
          </Container>
        </LocalizationProvider>
      </Container>

      <Divider sx={{ my: "0.8rem" }} />

      <Button
        sx={{ my: "0.5rem" }}
        variant="outlined"
        onClick={() => {
          setRepeations([...repetations, { time: "00:00" }]);
        }}
        disabled={viewOnly}
      >
        Add Time
      </Button>

      <Divider sx={{ my: "0.8rem" }} />
      <Box className="scroll-y">
        {repetations?.map((obj, i) => {
          return (
            <Box
              key={`TimePicker ${i}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                <Container
                  sx={{ p: "1rem", width: "100%" }}
                  components={["TimePicker"]}
                >
                  <TimePicker
                    fullWidth
                    sx={{ width: "100%" }}
                    value={dayjs(obj.time, `H:m`)}
                    label={`Timing ${i + 1}`}
                    onChange={(e) => {
                      setRepeations(
                        repetations.map((v, idx) => {
                          if (i === idx) {
                            return { time: e.format(`H:m`) };
                          } else {
                            return v;
                          }
                        })
                      );
                    }}
                    disabled={viewOnly}
                  />
                </Container>
              </LocalizationProvider>

              <Button
                sx={{ mr: "1rem" }}
                onClick={() => {
                  setRepeations(
                    repetations.filter((val, idx) => {
                      return i !== idx;
                    })
                  );
                }}
                disabled={viewOnly}
              >
                <DeleteOutlineOutlinedIcon color="red" />
              </Button>
            </Box>
          );
        })}
      </Box>
      <Divider />
    </>
  );
}

function SelectWeeklyTimings({
  repetations,
  setRepeations,
  viewOnly,
  firstDay,
  setFirstDay,
  lastDay,
  setLastDay,
}) {
  return (
    <Container className="scroll-y" sx={{ mt: "1.5rem" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container sx={{ m: "1rem", p: "0", pr: "1rem", width: "100%" }}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="Starting Date"
            value={dayjs(firstDay, "D/M/YYYY")}
            onChange={(newValue) => {
              setFirstDay(newValue.format(`D/M/YYYY`));
            }}
            disabled={viewOnly}
          />
        </Container>
        <Container sx={{ m: "1rem", p: "0", pr: "1rem", width: "100%" }}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="End Date"
            value={dayjs(lastDay, "D/M/YYYY")}
            onChange={(newValue) => {
              setLastDay(newValue.format(`D/M/YYYY`));
            }}
            disabled={viewOnly}
          />
        </Container>
      </LocalizationProvider>

      <Button
        variant="outlined"
        onClick={() => {
          setRepeations([...repetations, { time: "00:00" }]);
        }}
        disabled={viewOnly}
      >
        Add
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Divider />

        {repetations?.map((val, i) => {
          return (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id={`Day-Select-${i}`}>Day {i + 1}</InputLabel>
                  <Select
                    sx={{ width: "11rem" }}
                    labelId={`Day-Select-${i}`}
                    id="demo-simple-select"
                    value={val.day}
                    label={`Day ${i + 1}`}
                    onChange={(e) => {
                      setRepeations(
                        repetations.map((r, idx) => {
                          if (i === idx) {
                            return { ...r, day: e.target.value };
                          } else {
                            return r;
                          }
                        })
                      );
                    }}
                    disabled={viewOnly}
                  >
                    <MenuItem value={"monday"}>Monday</MenuItem>
                    <MenuItem value={"tuesday"}>Tuesday</MenuItem>
                    <MenuItem value={"wednesday"}>Wednesday</MenuItem>
                    <MenuItem value={"thursday"}>Thursday</MenuItem>
                    <MenuItem value={"friday"}>Friday</MenuItem>
                    <MenuItem value={"saturday"}>Saturday</MenuItem>
                    <MenuItem value={"sunday"}>Sunday</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                  <Container
                    sx={{ p: "1rem", width: "100%" }}
                    components={["TimePicker"]}
                    fullWidth
                  >
                    <TimePicker
                      sx={{ pr: "1rem", width: "100%" }}
                      fullWidth
                      value={dayjs(val.time, `H:m`)}
                      label={`Time`}
                      onChange={(e) => {
                        setRepeations(
                          repetations.map((v, idx) => {
                            if (i === idx) {
                              return { ...v, time: e.format(`H:m`) };
                            } else {
                              return v;
                            }
                          })
                        );
                      }}
                      disabled={viewOnly}
                    />
                  </Container>
                </LocalizationProvider>
                <Button
                  sx={{ ml: "1rem" }}
                  onClick={() => {
                    setRepeations(repetations.filter((val, idx) => i !== idx));
                  }}
                  disabled={viewOnly}
                >
                  <DeleteOutlineOutlinedIcon color="red" />
                </Button>
              </Box>
            </>
          );
        })}
        <Divider />
      </Box>
    </Container>
  );
}

function SelectMonthlyTimings({
  repetations,
  setRepeations,
  viewOnly,
  firstDay,
  setFirstDay,
  lastDay,
  setLastDay,
}) {
  let daysArr = [];
  for (let i = 1; i <= 31; i++) {
    daysArr.push(i);
  }

  return (
    <Container sx={{ mt: "1.5rem" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container sx={{ m: "1rem", p: "0", pr: "1rem", width: "100%" }}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="Starting Date"
            value={dayjs(firstDay, "D/M/YYYY")}
            onChange={(newValue) => {
              setFirstDay(newValue.format(`D/M/YYYY`));
            }}
            disabled={viewOnly}
          />
        </Container>
        <Container sx={{ m: "1rem", p: "0", pr: "1rem", width: "100%" }}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="End Date"
            value={dayjs(lastDay, "D/M/YYYY")}
            onChange={(newValue) => {
              setLastDay(newValue.format(`D/M/YYYY`));
            }}
            disabled={viewOnly}
          />
        </Container>
      </LocalizationProvider>

      <Button
        variant="outlined"
        onClick={() => {
          setRepeations([...repetations, { time: "00:00" }]);
        }}
        disabled={viewOnly}
      >
        Add
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Divider />

        {repetations?.map((val, i) => {
          return (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id={`Day-Select-${i}`}>Day</InputLabel>
                  <Select
                    sx={{ width: "11rem" }}
                    labelId={`Day-Select-${i}`}
                    id="demo-simple-select"
                    value={val.date}
                    label={`Day`}
                    onChange={(e) => {
                      setRepeations(
                        repetations.map((r, idx) => {
                          if (i === idx) {
                            return { ...r, date: e.target.value };
                          } else {
                            return r;
                          }
                        })
                      );
                    }}
                    disabled={viewOnly}
                  >
                    {daysArr.map((val, idx) => {
                      return <MenuItem value={val}>{val} </MenuItem>;
                    })}
                  </Select>
                </FormControl>

                <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                  <Container
                    sx={{ p: "1rem", width: "100%" }}
                    components={["TimePicker"]}
                    fullWidth
                  >
                    <TimePicker
                      sx={{ pr: "1rem", width: "100%" }}
                      fullWidth
                      value={dayjs(val.time, `H:m`)}
                      label={`Time`}
                      onChange={(e) => {
                        setRepeations(
                          repetations.map((v, idx) => {
                            if (i === idx) {
                              return { ...v, time: e.format(`H:m`) };
                            } else {
                              return v;
                            }
                          })
                        );
                      }}
                      disabled={viewOnly}
                    />
                  </Container>
                </LocalizationProvider>

                <Button
                  sx={{ ml: "1rem" }}
                  onClick={() => {
                    setRepeations(repetations.filter((val, idx) => i !== idx));
                  }}
                  disabled={viewOnly}
                >
                  <DeleteOutlineOutlinedIcon color="red" />
                </Button>
              </Box>
            </>
          );
        })}
        <Divider />
      </Box>
    </Container>
  );
}

function SelectAlternateDayTimings({
  repetations,
  setRepeations,
  firstDay,
  setFirstDay,
  lastDay,
  setLastDay,
  viewOnly,
}) {
  return (
    <>
      <Box className="scroll-y">
        <Container
          sx={{
            p: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container sx={{ p: "0", pr: "1rem", width: "100%" }}>
              <DatePicker
                fullWidth
                sx={{ width: "100%" }}
                label="Starting Date"
                value={dayjs(firstDay, "D/M/YYYY")}
                onChange={(newValue) => {
                  setFirstDay(newValue.format(`D/M/YYYY`));
                }}
                disabled={viewOnly}
              />
            </Container>
            <Container sx={{ p: "0", pr: "1rem", width: "100%" }}>
              <DatePicker
                fullWidth
                sx={{ width: "100%" }}
                label="End Date"
                value={dayjs(lastDay, "D/M/YYYY")}
                onChange={(newValue) => {
                  setLastDay(newValue.format(`D/M/YYYY`));
                }}
                disabled={viewOnly}
              />
            </Container>
          </LocalizationProvider>
          <Button
            variant="outlined"
            onClick={() => {
              setRepeations([...repetations, { time: "00:00" }]);
            }}
            disabled={viewOnly}
          >
            Add
          </Button>
        </Container>
        <Divider />
        {repetations?.map((obj, i) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                <Container
                  sx={{ p: "1rem", width: "100%" }}
                  components={["TimePicker"]}
                  fullWidth
                >
                  <TimePicker
                    fullWidth
                    sx={{ width: "100%" }}
                    value={dayjs(obj.time, `H:m`)}
                    label={`Timing ${i + 1}`}
                    onChange={(e) => {
                      setRepeations(
                        repetations.map((v, idx) => {
                          if (i === idx) {
                            return { time: e.format(`H:m`) };
                          } else {
                            return v;
                          }
                        })
                      );
                    }}
                    disabled={viewOnly}
                  />
                </Container>
              </LocalizationProvider>

              <Button
                sx={{ mr: "1rem" }}
                onClick={() => {
                  setRepeations(
                    repetations.filter((val, idx) => {
                      return i !== idx;
                    })
                  );
                }}
                disabled={viewOnly}
              >
                <DeleteOutlineOutlinedIcon color="red" />
              </Button>
            </Box>
          );
        })}
        <Divider />
      </Box>
    </>
  );
}
