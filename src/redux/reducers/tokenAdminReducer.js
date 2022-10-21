import ACTIONS from "../actions/";
const tokenAdmin = "";
const tokenAdminReducer = (state = tokenAdmin, action) => {
  switch (action.type) {
    case ACTIONS.GET_ADMIN_TOKEN:
      return action.payload;
    default:
      return state;
  }
};

export default tokenAdminReducer;
