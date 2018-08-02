import {
    GET_CONTACT,
    GET_CONTACTS,
    CONTACT_LOADING,
    DELETE_CONTACT,
} from '../types';

const initialState = {
    contact: null,
    contacts: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CONTACT_LOADING:
        console.log('reducer CONTACT_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_CONTACT:
            return {
                ...state,
                contact: action.payload,
                loading: false
            };
        case DELETE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.filter(contact => contact._id !== action.payload)
            };
        case GET_CONTACTS:
            return {
                ...state,
                contacts: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
