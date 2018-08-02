import axios from 'axios';

import { GET_ERRORS } from '../../common/types';

import {
  GET_CASE,
  DELETE_CASE,
  GET_CASES,
  CASE_LOADING,
} from '../types';

// Get Case
export const getCase = (id, userEmail) => dispatch => {
  dispatch(setCaseLoading());
  const serviceUrl = process.env.REACT_APP_CASE_SERVICE_URL;
  const url = `${serviceUrl}/api/case/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_CASE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_CASE,
        payload: null
      })
    );
};

// Add case
export const addCase = (caseData, callback) => dispatch => {
  dispatch(setCaseLoading());
  const serviceUrl = process.env.REACT_APP_CASE_SERVICE_URL;
  const url = `${serviceUrl}/api/case`; 
  console.log(url);
  axios
    .post(url, caseData)
    .then(res =>{
      dispatch({
        type: GET_CASE,
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

// Delete Case
export const deleteCase = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Case? This can NOT be undone!');
  if(!answer)
    return;  
    const serviceUrl = process.env.REACT_APP_CASE_SERVICE_URL;
    const url = `${serviceUrl}/api/case/${id}/${userEmail}`; 
    axios
    .delete(url)
    .then(res =>{
      console.log('deleteCase');
      console.log(id);
      dispatch({
        type: DELETE_CASE,
        payload: id
      });
    })
    .catch(err => {
      console.log('deleteCase err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};


// Get all cases
export const getCases = (searchTerm, userEmail) => dispatch => {
  dispatch(setCaseLoading());
  const serviceUrl = process.env.REACT_APP_CASE_SERVICE_URL;
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const url = `${serviceUrl}/api/case/search/${searchTerm}/${userEmail}`; 
  console.log('getCases ', url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_CASES,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_CASES,
        payload: null
      })
    );
};

// Case loading
export const setCaseLoading = () => {
  return {
    type: CASE_LOADING
  };
};

