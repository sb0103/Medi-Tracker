import axios from "axios";
import { BE_URL } from "../../config/config";

export async function getAllMedicines(token, setAlert) {
  try {
    let medicines = await axios.get(`${BE_URL}/medicines`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return medicines.data;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
  }
}

export async function addMedicine(token, setAlert, body) {
  try {
    let res = await axios.post(`${BE_URL}/medicines/add`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert("Medicine Added Successfully", "success");
    return res.data.medID;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
    return false;
  }
}

export async function modifyMedicine(token, setAlert, body) {
  try {
    await axios.put(`${BE_URL}/medicines`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert("Medicine Successfully Edited.", "success");
    return true;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }

    return false;
  }
}
