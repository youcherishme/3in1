import axios from 'axios';

import { GET_ERRORS } from '../../common/types';
import {
  GET_REPO,
  DELETE_REPO,
  GET_REPOS,
  REPO_LOADING,
} from '../types';

// Get Repo
export const getRepo = id => dispatch => {
  dispatch(setRepoLoading());
  const serviceUrl = process.env.REACT_APP_REPO_SERVICE_URL;
  const url = `${serviceUrl}/api/repo/${id}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_REPO,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_REPO,
        payload: null
      })
    );
};

// Add repo
export const addRepo = (repoData, callback) => dispatch => {
  dispatch(setRepoLoading());
  const serviceUrl = process.env.REACT_APP_REPO_SERVICE_URL;
  const url = `${serviceUrl}/api/repo`; 
  
  axios
    .post(url, repoData)
    .then(res =>{
      dispatch({
        type: GET_REPO,
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
export const deleteRepo = id => dispatch => {
  var answer = window.confirm('Are you sure to delete this Repo? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_REPO_SERVICE_URL;
    const url = `${serviceUrl}/api/repo/${id}`; 
    axios
    .delete(url)
    .then(res =>{
      dispatch({
        type: DELETE_REPO,
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

// Search repos
export const getRepos = (searchTerm) => dispatch => {
  dispatch(setRepoLoading());
  const serviceUrl = process.env.REACT_APP_REPO_SERVICE_URL;
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const url = `${serviceUrl}/api/repo/search/${searchTerm}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_REPOS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_REPOS,
        payload: null
      })
    );
};

// Repo loading
export const setRepoLoading = () => {
  return {
    type: REPO_LOADING
  };
};

