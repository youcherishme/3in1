import {
    GET_REPO,
    GET_REPOS,
    REPO_LOADING,
    DELETE_REPO,
} from '../types';

const initialState = {
    repo: null,
    repos: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REPO_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_REPO:
            return {
                ...state,
                repo: action.payload,
                loading: false
            };
        case DELETE_REPO:
            return {
                ...state,
                repos: state.repos.filter(repo => repo._id !== action.payload)
            };
        case GET_REPOS:
            return {
                ...state,
                repos: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
