import axios from 'axios';

import { GET_ERRORS } from '../../common/types';

import {
  GET_CLIENT,
  DELETE_CLIENT,
  GET_CLIENTS,
  CLIENT_LOADING,
} from '../types';

// Get Client
export const getClient = (id, userEmail) => dispatch => {
  dispatch(setClientLoading());

  const serviceUrl = process.env.REACT_APP_CLIENT_SERVICE_URL;
  const url = `${serviceUrl}/api/client/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_CLIENT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_CLIENT,
        payload: null
      })
    );
};
// Add client
export const addClient = (clientData, callback) => dispatch => {
  dispatch(setClientLoading());

  const serviceUrl = process.env.REACT_APP_CLIENT_SERVICE_URL;
  const url = `${serviceUrl}/api/client`; 
  console.log(url);
  axios
    .post(url, clientData)
    .then(res =>{
      dispatch({
        type: GET_CLIENT,
        payload: res.data
      });
      callback();
    })
    .catch(err => {
      console.log('addClient error ', err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Delete Client
export const deleteClient = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Client? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_CLIENT_SERVICE_URL;
    const url = `${serviceUrl}/api/client/${id}/${userEmail}`; 

    axios
    .delete(url)
    .then(res =>{
      console.log('deleteClient');
      console.log(id);
      dispatch({
        type: DELETE_CLIENT,
        payload: id
      });
    })
    .catch(err => {
      console.log('deleteClient err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Search clients
export const getClients = (searchTerm, userEmail) => dispatch => {
  dispatch(setClientLoading());
  const serviceUrl = process.env.REACT_APP_CLIENT_SERVICE_URL
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const url = `${serviceUrl}/api/client/search/${searchTerm}/${userEmail}`;
  console.log(url);
 
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_CLIENTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_CLIENTS,
        payload: null
      })
    );
};

// Client loading
export const setClientLoading = () => {
  return {
    type: CLIENT_LOADING
  };
};
