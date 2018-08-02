import {
    GET_ACTIVITY,
    GET_ACTIVITYS,
    ACTIVITY_LOADING,
    DELETE_ACTIVITY,
} from '../types';

const initialState = {
    activity: null,
    activitys: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTIVITY_LOADING:
        console.log('reducer ACTIVITY_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_ACTIVITY:
            return {
                ...state,
                activity: action.payload,
                loading: false
            };
        case DELETE_ACTIVITY:
            return {
                ...state,
                activitys: state.activitys.filter(activity => activity._id !== action.payload)
            };
        case GET_ACTIVITYS:
            return {
                ...state,
                activitys: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
