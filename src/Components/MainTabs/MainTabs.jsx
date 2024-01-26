import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import MedicineTab from "../MedicineTab/MedicineTab";
import PatientsTab from "../PatientsTab/PatientsTab";
import PrescriptionTab from "../PrescriptionTab/PrescriptionTab";
import TrackerTab from "../TrackerTab/TrackerTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MainTabs() {
  const [value, setValue] = React.useState(0);
  const [medicines, setMedicines] = React.useState([]);
  const [patients, setPatients] = React.useState([]);

  const fetchMedicines = () => {
    setMedicines([
      {
        _id: 9385925,
        medicineName: "Name1",
        doze: "100mg",
        description: "",
      },
      {
        _id: 9385926,
        medicineName: "Name2",
        doze: "100mg",
        description: "",
      },
      {
        _id: 9385927,
        medicineName: "Name3",
        doze: "100mg",
        description: "",
      },
      {
        _id: 9385928,
        medicineName: "Name4",
        doze: "100mg",
        description: "",
      },
      {
        _id: 9385929,
        medicineName: "Name5",
        doze: "100mg",
        description: "",
      },
      {
        _id: 9385930,
        medicineName: "Dolo",
        doze: "650mg",
        description: "For fever",
      },
      {
        _id: 9385931,
        medicineName: "Crocin Plus",
        doze: "1000mg",
        description: "For Fever",
      },
      {
        _id: 9385932,
        medicineName: "Crocin",
        doze: "500mg",
        description: "For Fever",
      },
      {
        _id: 9385933,
        medicineName: "DOLO 650",
        doze: "650mg",
        description: "For Fever",
      },
    ]);
  };
  const fetchPatients = () => {
    setPatients([
      {
        _id: 12343535,
        name: "Name1 Suname",
        age: 34,
        bmi: 8,
        prescription: [
          {
            _id: 9385925,
            medicineName: "Dolo",
            doze: "650mg",
            description: "For fever",
            times: {
              format: "daily",
              repetations: [{ time: "12:00" }, { time: "17:00" }],
            },
          },
        ],
        inventory: [
          {
            medicine: {
              _id: 9385923,
              medicineName: "Crocin Plus",
              doze: "1000mg",
              description: "For Fever",
            },
            quantity: 2,
          },
          {
            medicine: {
              _id: 9385924,
              medicineName: "Crocin",
              doze: "500mg",
              description: "For Fever",
            },
            quanitity: 12,
          },
          {
            medicine: {
              _id: 9385925,
              medicineName: "DOLO 650",
              doze: "650mg",
              description: "For Fever",
            },
            quanitity: 18,
          },
        ],
        otherDetails: "",
      },

      {
        _id: 12343536,
        name: "Name2 Suname",
        age: 34,
        bmi: 8,
        prescription: [
          {
            _id: 9385925,
            medicineName: "Dolo",
            doze: "650mg",
            description: "For fever",
            times: {
              format: "weekly",
              repetations: [
                { day: "monday", time: "12:00" },
                { day: "monday", time: "17:00" },
                { day: "tuesday", time: "12:00" },
                { day: "tuesday", time: "17:00" },
              ],
            },
          },
        ],
        inventory: [
          {
            medicine: {
              _id: 9385923,
              medicineName: "Crocin Plus",
              doze: "1000mg",
              description: "For Fever",
            },
            quanitity: 2,
          },
          {
            medicine: {
              _id: 9385924,
              medicineName: "Crocin",
              doze: "500mg",
              description: "For Fever",
            },
            quanitity: 12,
          },
          {
            medicine: {
              _id: 9385925,
              medicineName: "DOLO 650",
              doze: "650mg",
              description: "For Fever",
            },
            quanitity: 18,
          },
        ],
        otherDetails: "",
      },

      {
        _id: 12343536,
        name: "Name3 Suname",
        age: 34,
        bmi: 8,
        prescription: [
          {
            _id: 9385925,
            medicineName: "Dolo",
            doze: "650mg",
            description: "For fever",
            times: {
              format: "monthly",
              repetations: [
                { date: 1, time: "12:00" },
                { date: 1, time: "17:00" },
                { date: 2, time: "12:00" },
                { date: 2, time: "17:00" },
              ],
            },
          },
        ],
        inventory: [
          {
            medicine: {
              _id: 9385923,
              name: "Crocin Plus",
              doze: "1000mg",
              description: "For Fever",
            },
            quanitity: 2,
          },
          {
            medicine: {
              _id: 9385924,
              name: "Crocin",
              doze: "500mg",
              description: "For Fever",
            },
            quanitity: 12,
          },
          {
            medicine: {
              _id: 9385925,
              name: "DOLO 650",
              doze: "650mg",
              description: "For Fever",
            },
            quanitity: 18,
          },
        ],
        otherDetails: "",
      },

      {
        _id: 12343536,
        name: "Name4 Suname",
        age: 34,
        bmi: 8,
        prescription: [
          {
            _id: 9385925,
            medicineName: "Dolo",
            doze: "650mg",
            description: "For fever",
            times: {
              format: "alternate-day",
              firstDay: "1/1/2024",
              repetations: [{ time: "12:00" }, { time: "17:00" }],
            },
          },
        ],
        inventory: [
          {
            medicine: {
              _id: 9385923,
              name: "Crocin Plus",
              doze: "1000mg",
              description: "For Fever",
            },
            quanitity: 2,
          },
          {
            medicine: {
              _id: 9385924,
              name: "Crocin",
              doze: "500mg",
              description: "For Fever",
            },
            quanitity: 12,
          },
          {
            medicine: {
              _id: 9385925,
              name: "DOLO 650",
              doze: "650mg",
              description: "For Fever",
            },
            quanitity: 18,
          },
        ],
        otherDetails: "",
      },
    ]);

    return [
      {
        name: "1234",
        age: 34,
        bmi: 8,
        otherDetails: "",
      },
      {
        name: "dl342f",
        age: 34,
        bmi: 8,
        otherDetails: "",
      },
      {
        name: "dqrqanf",
        age: 34,
        bmi: 8,
        otherDetails: "",
      },
      {
        name: "dlkswqrqanf",
        age: 34,
        bmi: 8,
        otherDetails: "",
      },
      {
        name: "dlaksanf",
        age: 34,
        bmi: 8,
        otherDetails: "",
      },
      {
        name: "dlksrqweranaf",
        age: 34,
        bmi: 8,
        otherDetails: "",
      },
      {
        name: "dlksqeraanf",
        age: 34,
        bmi: 8,
        otherDetails: "",
      },
    ];
  };

  React.useEffect(() => {
    fetchMedicines();
    fetchPatients();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Medicine" {...a11yProps(0)} />
          <Tab label="Patient" {...a11yProps(1)} />
          <Tab label="Prescription" {...a11yProps(2)} />
          <Tab label="Tracker" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MedicineTab medicines={medicines} setMedicines={setMedicines} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PatientsTab patients={patients} setPatient={setPatients} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <PrescriptionTab
          medicines={medicines}
          patients={patients}
          setPatients={setPatients}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <TrackerTab medicines={medicines} patients={patients} />
      </CustomTabPanel>
    </Box>
  );
}
