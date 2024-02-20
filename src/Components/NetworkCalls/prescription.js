import axios from "axios";
import { BE_URL } from "../../config/config";

const setPrescription = async (token, setAlert, patientID, body) => {
  try {
    await axios.put(`${BE_URL}/prescriptions/${patientID}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAlert("Prescription Successfully Updated.", "success");

    return true;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else if (err.message) {
      setAlert(err.message, "error");
    }
    return false;
  }
};

export { setPrescription };
