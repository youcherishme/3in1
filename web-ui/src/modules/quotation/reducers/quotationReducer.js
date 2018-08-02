import {
    GET_QUOTATION,
    GET_QUOTATIONS,
    QUOTATION_LOADING,
    DELETE_QUOTATION,
} from '../types';

const initialState = {
    quotation: null,
    quotations: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case QUOTATION_LOADING:
        console.log('reducer QUOTATION_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_QUOTATION:
            return {
                ...state,
                quotation: action.payload,
                loading: false
            };
        case DELETE_QUOTATION:
            return {
                ...state,
                quotations: state.quotations.filter(quotation => quotation._id !== action.payload)
            };
        case GET_QUOTATIONS:
            return {
                ...state,
                quotations: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
