import {
    GET_APPOINTMENT,
    GET_APPOINTMENTS,
    APPOINTMENT_LOADING,
    DELETE_APPOINTMENT,
} from '../types';
import {
    GET_CLIENTS,
} from '../../client/types';

const initialState = {
    appointment: null,
    appointments: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case APPOINTMENT_LOADING:
            console.log('reducer APPOINTMENT_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_APPOINTMENT:
            return {
                ...state,
                appointment: action.payload,
                loading: false
            };
        case DELETE_APPOINTMENT:
            return {
                ...state,
                appointments: state.appointments.filter(appointment => appointment._id !== action.payload)
            };
        case GET_APPOINTMENTS:
            return {
                ...state,
                appointments: action.payload,
                loading: false
            };
        case GET_CLIENTS:
            console.log('reducer GET_CLIENTS ');
            return {
                ...state,
                clients: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
