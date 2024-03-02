import axios from "axios";
import { BE_URL } from "../../config/config";

const getTracker = async (token, setAlert, patientID) => {
  try {
    let t = await axios.get(`${BE_URL}/tracker/${patientID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAlert("Trackers Received from Server", "success");

    return t.data;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
  }
};

const postTracker = async (token, setAlert, patientID, body) => {
  try {
    await axios.post(`${BE_URL}/tracker/${patientID}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAlert("Tracker Successfully Updated/Added", "success");

    return true;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
    console.log(body);
    return false;
  }
};

const clearTracker = async (token, setAlert, patientID) => {
  try {
    await axios.delete(`${BE_URL}/tracker/${patientID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert("Tracker Data has been cleared.", "success");
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

export { getTracker, postTracker, clearTracker };
