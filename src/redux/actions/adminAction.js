import ACTIONS from "./index";
import axios from "axios";

export const dispatchAdminLogin = () => {
    return {
      type: ACTIONS.ADMIN_LOGIN,
    };
  };

export const fetchAdmin = async (tokenAdmin) => {
    const res = await axios.get("/admin/profile", {
      headers: { Authorization: tokenAdmin },
    });
    return res;
  };
  export const dispatchGetAdmin = (res) => {
    return {
      type: ACTIONS.GET_ADMIN,
      payload: {
        admin: res.data,
      },
    };
  };