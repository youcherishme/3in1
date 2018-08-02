import {
    GET_INVOICE,
    GET_INVOICES,
    INVOICE_LOADING,
    DELETE_INVOICE,
} from '../types';

const initialState = {
    invoice: null,
    invoices: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case INVOICE_LOADING:
        console.log('reducer INVOICE_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_INVOICE:
            return {
                ...state,
                invoice: action.payload,
                loading: false
            };
        case DELETE_INVOICE:
            return {
                ...state,
                invoices: state.invoices.filter(invoice => invoice._id !== action.payload)
            };
        case GET_INVOICES:
            return {
                ...state,
                invoices: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
