import {
    GET_EVENT,
    GET_EVENTS,
    EVENT_LOADING,
    DELETE_EVENT,
} from '../types';

const initialState = {
    event: null,
    events: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case EVENT_LOADING:
        console.log('reducer EVENT_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_EVENT:
            return {
                ...state,
                event: action.payload,
                loading: false
            };
        case DELETE_EVENT:
            return {
                ...state,
                events: state.events.filter(event => event._id !== action.payload)
            };
        case GET_EVENTS:
            return {
                ...state,
                events: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
