import ACTIONS from "../actions/";

const initialState = {
  doctor: [],
  isLogged: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        isLogged: true,
      };
    case ACTIONS.GET_DOCTOR:
      return {
        ...state,
        doctor: action.payload.doctor,
      };
    case ACTIONS.DELETE:
      return {
        ...state,
        doctor: [],
        isLogged: false,
      };
    default:
      return state;
  }
};

export default authReducer;
