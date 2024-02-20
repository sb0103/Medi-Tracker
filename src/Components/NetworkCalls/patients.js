import axios from "axios";
import { BE_URL } from "../../config/config";

const getAllPatients = async (token, setAlert) => {
  try {
    let patients = await axios.get(`${BE_URL}/patients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return patients.data;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
    return false;
  }
};

const addPatient = async (token, setAlert, body) => {
  try {
    let res = await axios.post(`${BE_URL}/patients/add`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert("Patient Successfully Added.", "success");
    return res.data._id;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
    return false;
  }
};

const modifyPatient = async (token, setAlert, patientID, body) => {
  try {
    await axios.put(`${BE_URL}/patients/${patientID}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert("Patient details Edited.", "success");
    return true;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
    return false;
  }
};

const deletePatient = async (token, setAlert, patientID) => {
  try {
    await axios.delete(`${BE_URL}/patients/${patientID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert("Patient data Removed", "success");
    return true;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }

    return false;
  }
};

export { getAllPatients, addPatient, modifyPatient, deletePatient };
