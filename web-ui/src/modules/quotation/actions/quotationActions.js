import axios from 'axios';

import { GET_ERRORS } from '../../common/types';

import {
  GET_QUOTATION,
  DELETE_QUOTATION,
  GET_QUOTATIONS,
  QUOTATION_LOADING,
} from '../types';

// Get Quotation
export const getQuotation = (id, userEmail) => dispatch => {
  dispatch(setQuotationLoading());
  const serviceUrl = process.env.REACT_APP_QUOTATION_SERVICE_URL;
  const url = `${serviceUrl}/api/quotation/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_QUOTATION,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_QUOTATION,
        payload: null
      })
    );
};

// Add quotation
export const addQuotation = (quotationData, callback) => dispatch => {
  dispatch(setQuotationLoading());
  const serviceUrl = process.env.REACT_APP_QUOTATION_SERVICE_URL;
  const url = `${serviceUrl}/api/quotation`; 
console.log(url)  
  axios
    .post(url, quotationData)
    .then(res =>{
      dispatch({
        type: GET_QUOTATION,
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

// Delete Quotation
export const deleteQuotation = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Quotation? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_QUOTATION_SERVICE_URL;
    const url = `${serviceUrl}/api/quotation/${id}/${userEmail}`; 
    axios
    .delete(url)
    .then(res =>{
      console.log('deleteQuotation');
      console.log(id);
      dispatch({
        type: DELETE_QUOTATION,
        payload: id
      });
    })
    .catch(err => {
      console.log('deleteQuotation err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Get getQuotationsByAttacher
export const getQuotationsByAttacher = (attacherid, attacherType, searchTerm, userEmail) => dispatch => {
  dispatch(setQuotationLoading());
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const serviceUrl = process.env.REACT_APP_QUOTATION_SERVICE_URL;
  const url = `${serviceUrl}/api/quotation/getQuotationsByAttacher/${attacherid}/${attacherType}/${searchTerm}/${userEmail}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_QUOTATIONS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_QUOTATIONS,
        payload: null
      })
    );
};



// Quotation loading
export const setQuotationLoading = () => {
  return {
    type: QUOTATION_LOADING
  };
};

