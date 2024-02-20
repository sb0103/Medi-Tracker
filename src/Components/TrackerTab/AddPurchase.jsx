import { Button } from "@mui/material";

import ListItem from "./ListItem";

export default function AddPurchase({
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
