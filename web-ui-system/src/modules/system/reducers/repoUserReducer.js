import {
    GET_REPOUSER,
    GET_REPOUSERS,
    REPOUSER_LOADING,
    DELETE_REPOUSER,
} from '../types';

const initialState = {
    repoUser: null,
    repoUsers: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REPOUSER_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_REPOUSER:
            return {
                ...state,
                repoUser: action.payload,
                loading: false
            };
        case DELETE_REPOUSER:
            return {
                ...state,
                repoUsers: state.repoUsers.filter(repoUser => repoUser._id !== action.payload)
            };
        case GET_REPOUSERS:
            return {
                ...state,
                repoUsers: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
