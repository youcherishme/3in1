import axios from 'axios';

import { GET_ERRORS } from '../../common/types';

import {
  GET_CONTACT,
  DELETE_CONTACT,
  GET_CONTACTS,
  CONTACT_LOADING,
} from '../types';

// Get Contact
export const getContact = id => dispatch => {
  dispatch(setContactLoading());
  const serviceUrl = process.env.REACT_APP_CONTACT_SERVICE_URL;
  const url = `${serviceUrl}/api/contact/${id}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_CONTACT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_CONTACT,
        payload: null
      })
    );
};

// Add contact
export const addContact = (contactData, callback) => dispatch => {
  dispatch(setContactLoading());
  const serviceUrl = process.env.REACT_APP_CONTACT_SERVICE_URL;
  const url = `${serviceUrl}/api/contact`; 
  
  axios
    .post(url, contactData)
    .then(res =>{
      dispatch({
        type: GET_CONTACT,
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

// Delete Contact
export const deleteContact = id => dispatch => {
  var answer = window.confirm('Are you sure to delete this Contact? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_CONTACT_SERVICE_URL;
    const url = `${serviceUrl}/api/contact/${id}`; 
    axios
    .delete(url)
    .then(res =>{
      dispatch({
        type: DELETE_CONTACT,
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

// Get Contacts By ClientId
export const getContactsByClientId = (clientid) => dispatch => {
  dispatch(setContactLoading());

  const serviceUrl = process.env.REACT_APP_CONTACT_SERVICE_URL;
  const url = `${serviceUrl}/api/contact/getContactsByClientId/${clientid}`; 

  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_CONTACTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_CONTACTS,
        payload: null
      })
    );
};

// Contact loading
export const setContactLoading = () => {
  return {
    type: CONTACT_LOADING
  };
};

