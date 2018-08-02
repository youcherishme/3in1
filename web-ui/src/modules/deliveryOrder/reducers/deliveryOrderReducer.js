import {
    GET_DELIVERY_ORDER,
    GET_DELIVERY_ORDERS,
    DELIVERY_ORDER_LOADING,
    DELETE_DELIVERY_ORDER,
} from '../types';

const initialState = {
    deliveryOrder: null,
    deliveryOrders: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case DELIVERY_ORDER_LOADING:
        console.log('reducer DELIVERY_ORDER_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_DELIVERY_ORDER:
            return {
                ...state,
                deliveryOrder: action.payload,
                loading: false
            };
        case DELETE_DELIVERY_ORDER:
            return {
                ...state,
                deliveryOrders: state.deliveryOrders.filter(deliveryOrder => deliveryOrder._id !== action.payload)
            };
        case GET_DELIVERY_ORDERS:
            return {
                ...state,
                deliveryOrders: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
