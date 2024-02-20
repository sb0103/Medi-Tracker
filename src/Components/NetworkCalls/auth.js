import axios from "axios";
import { BE_URL } from "../../config/config";

const login = async (body, setAlert) => {
  try {
    let res = await axios.post(`${BE_URL}/auth/login`, body);
    setAlert("User Successfully LoggedIn.", "success");
    return res.data;
  } catch (err) {
    if (err.response) {
      setAlert(err.response.data.message, "error");
    } else {
      setAlert(err.message, "error");
    }
    return false;
  }
};

/**
 * 
 * @param {Object} body 
 *  @example {
            "email":"random1332433@rediffmail.com",
            "password":"rareword12",
            "username":"huskyyy4234"
             }   
 * @param {func} setAlert 
                    Function to which message is passed
 */
const register = async (body, setAlert) => {
  try {
    await axios.post(`${BE_URL}/auth/register`, body);
    setAlert("User Successfully Registered.", "success");
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

export { login, register };
