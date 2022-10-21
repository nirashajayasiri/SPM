import ACTIONS from "../actions"

const initialState = {
    accounts: [],
}

const doctorReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.GET_ALL_DOCTORS:
            return {
                ...state,
                accounts: action.payload.doctors
            }
        default:
            return state
    }
}

export default doctorReducer