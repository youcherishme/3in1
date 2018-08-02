import {
    GET_CASE,
    GET_CASES,
    CASE_LOADING,
    DELETE_CASE,

} from '../types';

import {
    GET_CLIENTS,
} from '../../client/types';

import {
    GET_STAFFS,
} from '../../staff/types';


const initialState = {
    case: null,
    cases: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CASE_LOADING:
            console.log('reducer CASE_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_CASE:
            return {
                ...state,
                case_: action.payload,
                loading: false
            };
        case DELETE_CASE:
            return {
                ...state,
                cases: state.cases.filter(case_ => case_._id !== action.payload)
            };
        case GET_CASES:
            console.log('reducer GET_CASES ');
            return {
                ...state,
                cases: action.payload,
                loading: false
            };
        case GET_CLIENTS:
            console.log('reducer GET_CLIENTS ');
            return {
                ...state,
                clients: action.payload,
                loading: false
            };
        case GET_STAFFS:
            console.log('reducer GET_STAFFS ');
            return {
                ...state,
                staffs: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
