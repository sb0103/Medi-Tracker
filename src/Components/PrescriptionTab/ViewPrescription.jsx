import { Typography, Divider } from "@mui/material";
import ListItem from "./ListItem";

export default function ViewPrescription({
  name = "",
  age = "",
  bmi = "",
  prescription,
}) {
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
          return <ListItem key={i} listItem={listItem} i={i} viewOnly />;
        })}
      </div>
    </div>
  );
}
