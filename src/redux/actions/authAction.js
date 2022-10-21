import ACTIONS from "./index";
import axios from "axios";

export const dispatchLogin = () => {
  return {
    type: ACTIONS.LOGIN,
  };
};
export const fetchDoctor = async (token) => {
  const res = await axios.get("/doctor/profile", {
    headers: { Authorization: token },
  });
  return res;
};
export const dispatchGetDoctor = (res) => {
  return {
    type: ACTIONS.GET_DOCTOR,
    payload: {
      doctor: res.data,
    },
  };
};

export const dispatchDelete = (res) => {
  return {
    type: ACTIONS.DELETE,
  };
};
