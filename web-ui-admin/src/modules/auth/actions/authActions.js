import axios from 'axios';
import setAuthToken from '../../common/utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { SET_CURRENT_USER } from '../types';
import { GET_ERRORS } from '../../common/types';

// Register User
export const registerUser = (userData, callback) => dispatch => {
  const serviceUrl = process.env.REACT_APP_USER_SERVICE_URL;  
  const url = `${serviceUrl}/api/users/createuser`; 
  axios
    .post(url, userData)
    .then(res => callback())
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  const serviceUrl = process.env.REACT_APP_USER_SERVICE_URL;
  const url = `${serviceUrl}/api/users/loginadmin`; 
  console.log(url);
  axios
    .post(url, userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
