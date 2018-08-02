import axios from 'axios';

import { GET_ERRORS } from '../../common/types';

import {
  GET_PROJECT,
  DELETE_PROJECT,
  GET_PROJECTS,
  PROJECT_LOADING,
} from '../types';


// Get Project
export const getProject = (id, userEmail) => dispatch => {
  dispatch(setProjectLoading());
  const serviceUrl = process.env.REACT_APP_PROJECT_SERVICE_URL;
  const url = `${serviceUrl}/api/project/${id}/${userEmail}`; 

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: null
      })
    );
};

// Add project
export const addProject = (projectData, callback) => dispatch => {
  dispatch(setProjectLoading());

  const serviceUrl = process.env.REACT_APP_PROJECT_SERVICE_URL;
  const url = `${serviceUrl}/api/project`; 
  
  axios
    .post(url, projectData)
    .then(res =>{
      dispatch({
        type: GET_PROJECT,
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

// Delete Project
export const deleteProject = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Project? This can NOT be undone!');
  if(!answer)
    return;  
    const serviceUrl = process.env.REACT_APP_PROJECT_SERVICE_URL;
    const url = `${serviceUrl}/api/project/${id}/${userEmail}`; 
    axios
    .delete(url)
    .then(res =>{
      console.log('deleteProject');
      console.log(id);
      dispatch({
        type: DELETE_PROJECT,
        payload: id
      });
    })
    .catch(err => {
      console.log('deleteProject err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

export const getProjects = (searchTerm, userEmail) => dispatch => {
  dispatch(setProjectLoading());
  const serviceUrl = process.env.REACT_APP_PROJECT_SERVICE_URL;
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const url = `${serviceUrl}/api/project/search/${searchTerm}/${userEmail}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_PROJECTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// Project loading
export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};

