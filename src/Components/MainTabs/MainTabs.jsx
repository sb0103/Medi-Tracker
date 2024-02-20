import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import MedicineTab from "../MedicineTab/MedicineTab";
import PatientsTab from "../PatientsTab/PatientsTab";
import PrescriptionTab from "../PrescriptionTab/PrescriptionTab";
import TrackerTab from "../TrackerTab/TrackerTab";
import { useHistory } from "react-router-dom";

import { getAllMedicines } from "../NetworkCalls/medicines";
import { getAllPatientsRestructured } from "../Services/patients";

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

export default function MainTabs({ logged, setAlert }) {
  const [value, setValue] = React.useState(0);
  const [medicines, setMedicines] = React.useState([]);
  const [patients, setPatients] = React.useState([]);

  let history = useHistory();

  const fetchMedicines = async () => {
    let meds = await getAllMedicines(logged.token, (message, severity) => {
      setAlert({ isOpen: true, message, severity });
    });

    setMedicines(meds);
  };
  const fetchPatients = async () => {
    let patients = await getAllPatientsRestructured(
      logged.token,
      (message, severity) => {
        setAlert({ isOpen: true, message, severity });
      }
    );
    setPatients(patients);
  };

  React.useEffect(() => {
    if (!logged.isLogged) {
      history.push("/login");
      return;
    }

    fetchMedicines();
    fetchPatients();
  }, []);

  // React.useEffect(() => {
  //   fetchMedicines();
  // }, [medicines]);

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
        <MedicineTab
          logged={logged}
          medicines={medicines}
          setMedicines={setMedicines}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PatientsTab
          logged={logged}
          patients={patients}
          setPatient={setPatients}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <PrescriptionTab
          logged={logged}
          medicines={medicines}
          patients={patients}
          setPatients={setPatients}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <TrackerTab logged={logged} medicines={medicines} patients={patients} />
      </CustomTabPanel>
    </Box>
  );
}
