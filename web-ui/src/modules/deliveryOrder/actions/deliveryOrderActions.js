import axios from 'axios';

import { GET_ERRORS } from '../../common/types';

import {
  GET_DELIVERY_ORDER,
  DELETE_DELIVERY_ORDER,
  GET_DELIVERY_ORDERS,
  DELIVERY_ORDER_LOADING,
} from '../types';

// Get deliveryOrder
export const getDeliveryOrder = (id, userEmail) => dispatch => {
  dispatch(setDeliveryOrderLoading());
  const serviceUrl = process.env.REACT_APP_DELIVERY_ORDER_SERVICE_URL;
  const url = `${serviceUrl}/api/deliveryOrder/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_DELIVERY_ORDER,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_DELIVERY_ORDER,
        payload: null
      })
    );
};

// Add deliveryOrder
export const addDeliveryOrder = (deliveryOrderData, callback) => dispatch => {
  dispatch(setDeliveryOrderLoading());
  const serviceUrl = process.env.REACT_APP_DELIVERY_ORDER_SERVICE_URL;
  const url = `${serviceUrl}/api/deliveryOrder`; 
console.log(url)  
  axios
    .post(url, deliveryOrderData)
    .then(res =>{
      dispatch({
        type: GET_DELIVERY_ORDER,
        payload: res.data
      });
      callback();
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Delete deliveryOrder
export const deleteDeliveryOrder = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this deliveryOrder? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_DELIVERY_ORDER_SERVICE_URL;
    const url = `${serviceUrl}/api/deliveryOrder/${id}/${userEmail}`; 
    axios
    .delete(url)
    .then(res =>{
      console.log('delete deliveryOrder', id);
      dispatch({
        type: DELETE_DELIVERY_ORDER,
        payload: id
      });
    })
    .catch(err => {
      console.log('deletedeliveryOrder err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Get getdeliveryOrdersByAttacher
export const getDeliveryOrdersByAttacher = (attacherid, attacherType, searchTerm, userEmail) => dispatch => {
  dispatch(setDeliveryOrderLoading());
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const serviceUrl = process.env.REACT_APP_DELIVERY_ORDER_SERVICE_URL;
  const url = `${serviceUrl}/api/deliveryOrder/getdeliveryOrdersByAttacher/${attacherid}/${attacherType}/${searchTerm}/${userEmail}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_DELIVERY_ORDERS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_DELIVERY_ORDERS,
        payload: null
      })
    );
};



// deliveryOrder loading
export const setDeliveryOrderLoading = () => {
  return {
    type: DELIVERY_ORDER_LOADING
  };
};

