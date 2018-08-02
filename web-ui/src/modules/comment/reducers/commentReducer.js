import {
    GET_COMMENT,
    GET_COMMENTS,
    COMMENT_LOADING,
    DELETE_COMMENT,
} from '../types';

import { SET_CURRENT_USER } from '../../auth/types';
import isEmpty from '../../common/validation/is-empty';

const initialState = {
    comment: null,
    comments: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case COMMENT_LOADING:
            console.log('reducer COMMENT_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_COMMENT:
            return {
                ...state,
                comment: action.payload,
                loading: false
            };
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(comment => comment._id !== action.payload)
            };
        case GET_COMMENTS:
            return {
                ...state,
                comments: action.payload,
                loading: false
            };
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        default:
            return state;
    }
}
