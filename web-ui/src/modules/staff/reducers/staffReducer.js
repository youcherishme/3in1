import {
    GET_STAFF,
    GET_STAFFS,
    STAFF_LOADING,
    DELETE_STAFF,
} from '../types';

const initialState = {
    staff: null,
    staffs: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case STAFF_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_STAFF:
            return {
                ...state,
                staff: action.payload,
                loading: false
            };
        case DELETE_STAFF:
            return {
                ...state,
                staffs: state.staffs.filter(staff => staff._id !== action.payload)
            };
        case GET_STAFFS:
            return {
                ...state,
                staffs: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
