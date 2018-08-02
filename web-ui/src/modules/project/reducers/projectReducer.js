import {
    GET_PROJECT,
    GET_PROJECTS,
    PROJECT_LOADING,
    DELETE_PROJECT,

} from '../types';

import {
    GET_CLIENTS,
} from '../../client/types';

import {
    GET_STAFFS,
} from '../../staff/types';

const initialState = {
    project: null,
    projects: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case PROJECT_LOADING:
            console.log('reducer PROJECT_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_PROJECT:
            return {
                ...state,
                project: action.payload,
                loading: false
            };
        case DELETE_PROJECT:
            return {
                ...state,
                projects: state.projects.filter(project => project._id !== action.payload)
            };
        case GET_PROJECTS:
            console.log('reducer GET_PROJECTS ');
            return {
                ...state,
                projects: action.payload,
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
