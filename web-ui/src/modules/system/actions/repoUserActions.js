import axios from 'axios';

import { GET_ERRORS } from '../../common/types';
import {
  GET_REPOUSER,
  DELETE_REPOUSER,
  GET_REPOUSERS,
  REPOUSER_LOADING,
} from '../types';

// Get Repo
export const getRepoUser = id => dispatch => {
  dispatch(setRepoUserLoading());
  const serviceUrl = process.env.REACT_APP_REPOUSER_SERVICE_URL;
  const url = `${serviceUrl}/api/repoUser/${id}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_REPOUSER,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_REPOUSER,
        payload: null
      })
    );
};

// Add repoUser
export const addRepoUser = (repoUserData, callback) => dispatch => {
  dispatch(setRepoUserLoading());
  const serviceUrl = process.env.REACT_APP_REPOUSER_SERVICE_URL;
  const url = `${serviceUrl}/api/repoUser`; 
  
  axios
    .post(url, repoUserData)
    .then(res =>{
      dispatch({
        type: GET_REPOUSER,
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

// Delete Repo
export const deleteRepoUser = id => dispatch => {
  var answer = window.confirm('Are you sure to delete this Repo? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_REPOUSER_SERVICE_URL;
    const url = `${serviceUrl}/api/repoUser/${id}`; 
    axios
    .delete(url)
    .then(res =>{
      dispatch({
        type: DELETE_REPOUSER,
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

// Search repoUsers
export const getRepoUsers = (searchTerm) => dispatch => {
  dispatch(setRepoUserLoading());
  const serviceUrl = process.env.REACT_APP_REPOUSER_SERVICE_URL;
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const url = `${serviceUrl}/api/repoUser/search/${searchTerm}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_REPOUSERS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_REPOUSERS,
        payload: null
      })
    );
};

// Repo loading
export const setRepoUserLoading = () => {
  return {
    type: REPOUSER_LOADING
  };
};

