import axios from 'axios';

import { GET_ERRORS } from '../../common/types';
import {
  GET_STAFF,
  DELETE_STAFF,
  GET_STAFFS,
  STAFF_LOADING,
} from '../types';

// Get Staff
export const getStaff = id => dispatch => {
  dispatch(setStaffLoading());
  const serviceUrl = process.env.REACT_APP_STAFF_SERVICE_URL;
  const url = `${serviceUrl}/api/staff/${id}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_STAFF,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_STAFF,
        payload: null
      })
    );
};

// Add staff
export const addStaff = (staffData, callback) => dispatch => {
  dispatch(setStaffLoading());
  const serviceUrl = process.env.REACT_APP_STAFF_SERVICE_URL;
  const url = `${serviceUrl}/api/staff`; 
  
  axios
    .post(url, staffData)
    .then(res =>{
      dispatch({
        type: GET_STAFF,
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

// Delete Staff
export const deleteStaff = id => dispatch => {
  var answer = window.confirm('Are you sure to delete this Staff? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_STAFF_SERVICE_URL;
    const url = `${serviceUrl}/api/staff/${id}`; 
    axios
    .delete(url)
    .then(res =>{
      dispatch({
        type: DELETE_STAFF,
        payload: id
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Search staffs
export const getStaffs = (searchTerm) => dispatch => {
  dispatch(setStaffLoading());
  const serviceUrl = process.env.REACT_APP_STAFF_SERVICE_URL;
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const url = `${serviceUrl}/api/staff/search/${searchTerm}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_STAFFS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_STAFFS,
        payload: null
      })
    );
};

// Staff loading
export const setStaffLoading = () => {
  return {
    type: STAFF_LOADING
  };
};

