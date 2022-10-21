import ACTIONS from "../actions/";

const initialState = {
  admin:[],
  isAdminLogged: false,
  isAdmin: false,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
      case ACTIONS.ADMIN_LOGIN:
      return {
        ...state,
        isAdminLogged: true,
        isAdmin: true
      };
      case ACTIONS.GET_ADMIN:
      return {
        ...state,
        admin: action.payload.admin,
      };
    case ACTIONS.DELETE:
      return {
        ...state,
        admin: [],
        isAdminLogged: false,
        isAdmin: false,
      };
    default:
      return state;
  }
};

export default adminReducer;
