import axios from 'axios';
import { GET_ERRORS } from '../../common/types';

import {
  GET_ACTIVITY,
  DELETE_ACTIVITY,
  GET_ACTIVITYS,
  ACTIVITY_LOADING,
} from '../types';

// Get Activity
export const getActivity = (id, userEmail) => dispatch => {
  dispatch(setActivityLoading());
  const serviceUrl = process.env.REACT_APP_ACTIVITY_SERVICE_URL;
  const url = `${serviceUrl}/api/activity/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_ACTIVITY,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ACTIVITY,
        payload: null
      })
    );
};

// Add activity
export const addActivity = (activityData, callback) => dispatch => {
  debugger
  dispatch(setActivityLoading());
  const serviceUrl = process.env.REACT_APP_ACTIVITY_SERVICE_URL;
  const url = `${serviceUrl}/api/activity`; 
  debugger
  axios
    .post(url, activityData)
    .then(res =>{
      dispatch({
        type: GET_ACTIVITY,
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

// Delete Activity
export const deleteActivity = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Activity? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_ACTIVITY_SERVICE_URL;
    const url = `${serviceUrl}/api/activity/${id}/${userEmail}`; 
    axios
    .delete(url)
    .then(res =>{
      dispatch({
        type: DELETE_ACTIVITY,
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

// Get getActivitysByAttacher
export const getActivitysByAttacher = (searchTerm, userEmail) => dispatch => {
  dispatch(setActivityLoading());
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const serviceUrl = process.env.REACT_APP_ACTIVITY_SERVICE_URL;
  const url = `${serviceUrl}/api/activity/getActivitysByAttacher/${searchTerm}/${userEmail}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        console.log('getActivitys');
        dispatch({
          type: GET_ACTIVITYS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_ACTIVITYS,
        payload: null
      })
    );
};

// Activity loading
export const setActivityLoading = () => {
  return {
    type: ACTIVITY_LOADING
  };
};

