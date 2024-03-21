import { Button, Divider, Container } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

import ListItem from "./ListItem";

export default function AddPurchase({
  name = "",
  age = "",
  bmi = "",
  medicines,
  formInput,
  setFormInput,
  purchaseDate,
  setPurchaseDate,
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

        <Divider />
        <Button
          sx={{ px: "1rem", width: "12rem" }}
          variant="outlined"
          onClick={() => {
            setFormInput((prevState) => [
              ...prevState,
              { medicineName: "", doze: "", quantity: 0 },
            ]);
          }}
        >
          Add Medicine
        </Button>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container
          sx={{ p: "0", pr: "1rem", width: "40%", m: "auto", my: "1rem" }}
        >
          <DatePicker
            format="DD/MMM/YYYY"
            fullWidth
            sx={{ width: "100%" }}
            label="Purchase Date"
            value={dayjs(purchaseDate, "D/M/YYYY")}
            onChange={(newValue) => {
              setPurchaseDate(newValue.format(`D/M/YYYY`));
            }}
            defaultVaue={dayjs()}
          />
        </Container>
      </LocalizationProvider>

      <div className="medicines">
        {formInput.map((listItem, i) => {
          return (
            <ListItem
              key={i}
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
