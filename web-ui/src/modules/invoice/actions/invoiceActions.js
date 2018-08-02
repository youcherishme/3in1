import axios from 'axios';
import { GET_ERRORS } from '../../common/types';

import {
  GET_INVOICE,
  DELETE_INVOICE,
  GET_INVOICES,
  INVOICE_LOADING,
} from '../types';

// Get Invoice
export const getInvoice = (id, userEmail) => dispatch => {
  dispatch(setInvoiceLoading());
  const serviceUrl = process.env.REACT_APP_INVOICE_SERVICE_URL;
  const url = `${serviceUrl}/api/invoice/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_INVOICE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_INVOICE,
        payload: null
      })
    );
};

// Add invoice
export const addInvoice = (invoiceData, callback) => dispatch => {
  dispatch(setInvoiceLoading());
  const serviceUrl = process.env.REACT_APP_INVOICE_SERVICE_URL;
  const url = `${serviceUrl}/api/invoice`; 
  
  axios
    .post(url, invoiceData)
    .then(res =>{
      dispatch({
        type: GET_INVOICE,
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

// Delete Invoice
export const deleteInvoice = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Invoice? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_INVOICE_SERVICE_URL;
    const url = `${serviceUrl}/api/invoice/${id}/${userEmail}`; 
    axios
    .delete(url)
    .then(res =>{
      console.log('deleteInvoice');
      console.log(id);
      dispatch({
        type: DELETE_INVOICE,
        payload: id
      });
    })
    .catch(err => {
      console.log('deleteInvoice err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Get getInvoicesByAttacher
export const getInvoicesByAttacher = (attacherid, attacherType, searchTerm, userEmail) => dispatch => {
  dispatch(setInvoiceLoading());
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const serviceUrl = process.env.REACT_APP_INVOICE_SERVICE_URL;
  const url = `${serviceUrl}/api/invoice/getInvoicesByAttacher/${attacherid}/${attacherType}/${searchTerm}/${userEmail}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_INVOICES,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_INVOICES,
        payload: null
      })
    );
};


// Invoice loading
export const setInvoiceLoading = () => {
  return {
    type: INVOICE_LOADING
  };
};

