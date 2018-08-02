import axios from 'axios';
import { GET_ERRORS } from '../../common/types';

import {
  GET_APPOINTMENT,
  DELETE_APPOINTMENT,
  GET_APPOINTMENTS,
  APPOINTMENT_LOADING,
} from '../types';

// Get Appointment
export const getAppointment = (id, userEmail) => dispatch => {
  dispatch(setAppointmentLoading());
  const serviceUrl = process.env.REACT_APP_APPOINTMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/appointment/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_APPOINTMENT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_APPOINTMENT,
        payload: null
      })
    );
};

// Add appointment
export const addAppointment = (appointmentData, callback) => dispatch => {
  dispatch(setAppointmentLoading());
  const serviceUrl = process.env.REACT_APP_APPOINTMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/appointment`; 
  
  axios
    .post(url, appointmentData)
    .then(res =>{
      dispatch({
        type: GET_APPOINTMENT,
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

// Delete Appointment
export const deleteAppointment = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Appointment? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_APPOINTMENT_SERVICE_URL;
    const url = `${serviceUrl}/api/appointment/${id}/${userEmail}`; 
    axios
    .delete(url)
    .then(res =>{
      dispatch({
        type: DELETE_APPOINTMENT,
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

// Get getAppointmentsByAttacher
export const getAppointmentsByAttacher = (attacherid, attacherType, searchTerm, userEmail) => dispatch => {
  dispatch(setAppointmentLoading());
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const serviceUrl = process.env.REACT_APP_APPOINTMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/appointment/getAppointmentsByAttacher/${attacherid}/${attacherType}/${searchTerm}/${userEmail}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        console.log('getAppointments ');
        dispatch({
          type: GET_APPOINTMENTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_APPOINTMENTS,
        payload: null
      })
    );
};

// Appointment loading
export const setAppointmentLoading = () => {
  return {
    type: APPOINTMENT_LOADING
  };
};

