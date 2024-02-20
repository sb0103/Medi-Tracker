import axios from "axios";
import { BE_URL } from "../../config/config";

const postPurchase = async (token, setAlert, patientID, body) => {
  try {
    await axios.post(`${BE_URL}/purchases/${patientID}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert("Purchase Successfully Added", "success");
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
  }
};

export { postPurchase };
