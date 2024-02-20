import axios from "axios";
import { BE_URL } from "../../config/config";

const fetchInventory = async (token, setAlert, patientID) => {
  try {
    let response = await axios.get(`${BE_URL}/inventory/${patientID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
  }
};

export { fetchInventory };
