import { Typography, Button, Divider } from "@mui/material";
import ListItem from "./ListItem";

export default function AddPrescription({
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
          sx={{ px: "1rem", width: "12rem" }}
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
          Add
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
              key={i}
              medicines={medicines.filter(
                (med) =>
                  prescription.find((item) => {
                    if (item.medID === med._id) {
                      return true;
                    }
                    return false;
                  }) === undefined
              )}
              listItem={listItem}
              i={i}
              setListItem={(newListItem, i) => {
                setPrescription(
                  prescription.map((v, idx) => {
                    if (v.medID === listItem.medID && i === idx) {
                      return newListItem;
                    } else {
                      return v;
                    }
                  })
                );
              }}
              removeListItem={() => {
                setPrescription(
                  prescription.filter((v) => v.medID !== listItem.medID)
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
