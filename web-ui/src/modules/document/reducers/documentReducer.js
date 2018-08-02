import {
    ADD_DOCUMENT,
    GET_DOCUMENT,
    GET_DOCUMENTS,
    DOCUMENT_LOADING,
    DELETE_DOCUMENT,
    UPLOAD_DOCUMENT,
    UPLOAD_ERRORS,
} from '../types';

import { SET_CURRENT_USER } from '../../auth/types';
import isEmpty from '../../common/validation/is-empty';

const initialState = {
    document: null,
    documents: null,
    loading: false
};

export default function (state = initialState, action) {
    console.log('reducer  ' + action.type);
    switch (action.type) {
        case DOCUMENT_LOADING:
            return {
                ...state,
                loading: true,
            };

        case ADD_DOCUMENT:
            return {
                ...state,
                document: action.payload,
                loading: false
            };
        case GET_DOCUMENT:
            return {
                ...state,
                document: action.payload,
                loading: false
            };
        case UPLOAD_DOCUMENT:
            return {
                ...state,
                uploadFile: action.payload,
                loading: false
            };
        case UPLOAD_ERRORS:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        case DELETE_DOCUMENT:
            return {
                ...state,
                documents: state.documents.filter(document => document._id !== action.payload)
            };
        case GET_DOCUMENTS:
            return {
                ...state,
                documents: action.payload,
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
