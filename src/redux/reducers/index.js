import { combineReducers } from "redux";
import auth from "./authReducer";
import token from "./tokenReducer";
import tokenAdmin from "./tokenAdminReducer";
import admin from "./adminReducer";
import doctors from "./DoctorsReducer";

export default combineReducers({
  auth,
  token,
  tokenAdmin,
  doctors,
  admin
});
