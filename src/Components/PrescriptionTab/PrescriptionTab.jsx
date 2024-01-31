import { useEffect, useState } from "react";
import "./prescription-tab.css";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Container,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import BasicTable from "../BasicTable/BasicTable";
import FormDialog from "../FormDialog/FormDialog";

import dayjs from "dayjs";

export default function PrescriptionTab({ medicines, patients, setPatients }) {
  return (
    <>
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

function AddPrescription({
  name,
  age,
  bmi,
  medicines,
  prescription,
  setPrescription,
}) {
  return (
    <div style={{ width: "55rem", maxWidth: "90vw" }}>
      <div className="prescription-bar">
        <div className="patient-details" style={{ width: "70%" }}>
          <div style={{ flex: 3 }}>
            {"Name:  "}
            <Typography component={"span"} sx={{ fontWeight: 300 }}>
              {name}
            </Typography>
          </div>
          <div>
            {"Age:   "}
            <Typography component={"span"} sx={{ fontWeight: 300 }}>
              {age}
            </Typography>
          </div>
          <div>
            {"BMI:   "}
            <Typography component={"span"} sx={{ fontWeight: 300 }}>
              {bmi}
            </Typography>
          </div>
        </div>
        <Button
          sx={{ px: "1rem", width: "7rem" }}
          variant="outlined"
          onClick={() => {
            setPrescription([
              ...prescription,
              {
                medicineName: "",
                doze: "",
                times: { format: "daily", repetations: [] },
              },
            ]);
          }}
        >
          ADD
        </Button>
      </div>
      <Divider />
      <div className="medicines">
        <div className="medicine">
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          >
            Medicine Name
          </div>
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          >
            Doze
          </div>
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          >
            Timings
          </div>
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          ></div>
        </div>
        <Divider flexItem />

        {prescription.map((listItem, i) => {
          return (
            <ListItem
              key={listItem._id}
              medicines={medicines}
              listItem={listItem}
              i={i}
              setListItem={(newListItem) => {
                setPrescription(
                  prescription.map((v) => {
                    if (v._id === listItem._id) {
                      return newListItem;
                    } else {
                      return v;
                    }
                  })
                );
              }}
              removeListItem={() => {
                setPrescription(
                  prescription.filter((v) => v._id !== listItem._id)
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ViewPrescription({ name = "", age = "", bmi = "", prescription }) {
  return (
    <div style={{ width: "35rem" }}>
      <div className="prescription-bar">
        <div className="patient-details" style={{ width: "90%" }}>
          <div style={{ flex: 2 }}>
            {"Name:  "}
            <Typography component={"span"} sx={{ fontWeight: 300 }}>
              {name}
            </Typography>
          </div>
          <div>
            {"Age:   "}
            <Typography component={"span"} sx={{ fontWeight: 300 }}>
              {age}
            </Typography>
          </div>
          <div>
            {"BMI:   "}
            <Typography component={"span"} sx={{ fontWeight: 300 }}>
              {bmi}
            </Typography>
          </div>
        </div>
      </div>
      <Divider />
      <div className="medicines">
        <div className="medicine">
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          >
            Medicine Name
          </div>
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          >
            Doze
          </div>
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          ></div>
        </div>
        <Divider flexItem />
        {prescription.map((listItem, i) => {
          return (
            <ListItem key={listItem._id} listItem={listItem} i={i} viewOnly />
          );
        })}
      </div>
    </div>
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
    if (
      listItem.medicineName === "" &&
      listItem.doze === "" &&
      viewOnly === false
    ) {
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
          <Typography>{listItem.medicineName}</Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography> {listItem.doze} </Typography>
        </div>
        <div
          style={{
            flex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormDialog
            btnContent={"View Timings"}
            btnVariant="text"
            btnSx={{ fontSize: "0.7rem" }}
            title={"View Timings"}
            content=""
            form={
              <SelectTimings
                times={listItem.times}
                setTimes={(times) => {
                  setListItem({ ...listItem, times });
                }}
                viewOnly={true}
              />
            }
            removeCancel
          />
        </div>

        {viewOnly === false ? (
          <div className="pres-btn-bar">
            <Button
              variant="text"
              onClick={() => {
                removeListItem();
              }}
            >
              <DeleteRoundedIcon color="primary" />
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setEditState(true);
              }}
            >
              <EditRoundedIcon color="primary" />
            </Button>
          </div>
        ) : (
          <div
            style={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {listItem.description}
          </div>
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
              value={listItem.medicineName}
              onChange={(e) => {
                setListItem({
                  ...listItem,
                  medicineName: e.target.value,
                  doze: "",
                });

                // setListVal((prevState) => {
                //   return {
                //     ...prevState,
                //     medicineName: e.target.value,
                //     doze: "",
                //   };
                // });
              }}
            >
              <MenuItem key={"none"} value={""}>
                None
              </MenuItem>
              {medicines.map((med, i) => {
                return (
                  <MenuItem key={`med ${i}`} value={med.medicineName}>
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
              value={listItem.doze}
              onChange={(e) => {
                setListItem({ ...listItem, doze: e.target.value });

                // setListVal((prevState) => {
                //   return { ...prevState, doze: e.target.value };
                // });
              }}
            >
              <MenuItem key={"None"} value={""}>
                None
              </MenuItem>
              {medicines
                .filter((med) => med.medicineName === listItem.medicineName)
                .map((med, i) => {
                  return (
                    <MenuItem key={`doze ${i}`} value={med.doze}>
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
          <FormDialog
            btnContent={"Set Timings"}
            btnVariant={"text"}
            title={"Set Timings"}
            content=""
            form={
              <SelectTimings
                times={listItem.times}
                setTimes={(times) => {
                  setListItem({ ...listItem, times });
                }}
                viewOnly={viewOnly}
              />
            }
            removeCancel
          />
        </div>
        <div className="pres-btn-bar">
          <Button
            variant="text"
            onClick={() => {
              removeListItem();
            }}
          >
            <DeleteRoundedIcon color="primary" />
          </Button>
          <Button
            variant="text"
            onClick={() => {
              let _id = medicines.find((med) => {
                return (
                  med.medicineName === listItem.medicineName &&
                  med.doze === listItem.doze
                );
              })?._id;
              setListItem({ ...listItem, _id });
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

function SelectTimings({ times, setTimes, viewOnly = false }) {
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
              if (!viewOnly) setTimes({ ...times, format: e.target.value });
            }}
            disabled={viewOnly}
          >
            <MenuItem value={"daily"}>Daily</MenuItem>
            <MenuItem value={"weekly"}>Weekly</MenuItem>
            <MenuItem value={"monthly"}>Monthly</MenuItem>
            <MenuItem value={"alternate-day"}>Alternate Day</MenuItem>
          </Select>
        </FormControl>

        {times.format === "daily" ? (
          <SelectDailyTimings
            repetations={times.repetations}
            setRepeations={(r) => {
              setTimes({ ...times, repetations: r });
            }}
            viewOnly={viewOnly}
          />
        ) : times.format === "weekly" ? (
          <SelectWeeklyTimings
            repetations={times.repetations}
            setRepeations={(r) => {
              setTimes({ ...times, repetations: r });
            }}
            viewOnly={viewOnly}
          />
        ) : times.format === "monthly" ? (
          <SelectMonthlyTimings
            repetations={times.repetations}
            setRepeations={(r) => {
              setTimes({ ...times, repetations: r });
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
            viewOnly={viewOnly}
          />
        ) : (
          <></>
        )}
      </Container>
    </Box>
  );
}

function SelectDailyTimings({ repetations, setRepeations, viewOnly }) {
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
              <DeleteRoundedIcon color="primary" />
            </Button>
          </Box>
        );
      })}
      <Divider />
    </>
  );
}

function SelectWeeklyTimings({ repetations, setRepeations, viewOnly }) {
  return (
    <Container sx={{ mt: "1.5rem" }}>
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
                  <DeleteRoundedIcon color="primary" />
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

function SelectMonthlyTimings({ repetations, setRepeations, viewOnly }) {
  let daysArr = [];
  for (let i = 1; i <= 31; i++) {
    daysArr.push(i);
  }

  return (
    <Container sx={{ mt: "1.5rem" }}>
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
                            return { ...r, day: e.target.value };
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
                  <DeleteRoundedIcon color="primary" />
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
  viewOnly,
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
              <DeleteRoundedIcon color="primary" />
            </Button>
          </Box>
        );
      })}
      <Divider />
    </>
  );
}
