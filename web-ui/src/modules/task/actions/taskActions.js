import axios from 'axios';
import { GET_ERRORS } from '../../common/types';

import {
  GET_TASK,
  DELETE_TASK,
  GET_TASKS,
  TASK_LOADING,
} from '../types';

// Get Task
export const getTask = (id, userEmail) => dispatch => {
  dispatch(setTaskLoading());
  const serviceUrl = process.env.REACT_APP_TASK_SERVICE_URL;
  const url = `${serviceUrl}/api/task/${id}/${userEmail}`; 
  console.log('getTask ', url);

  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_TASK,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_TASK,
        payload: null
      })
    );
};

// Add task
export const addTask = (taskData, callback) => dispatch => {
  dispatch(setTaskLoading());
  const serviceUrl = process.env.REACT_APP_TASK_SERVICE_URL;
  const url = `${serviceUrl}/api/task`; 
  axios
    .post(url, taskData)
    .then(res =>{
      dispatch({
        type: GET_TASK,
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

// Delete Task
export const deleteTask = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Task? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_TASK_SERVICE_URL;
    const url = `${serviceUrl}/api/task/${id}/${userEmail}`; 
    console.log('deleteTask ', url)
    axios
    .delete(url)
    .then(res =>{
      dispatch({
        type: DELETE_TASK,
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

// Get getTasksByAttacher
export const getTasksByAttacher = (attacherid, attacherType, searchTerm, userEmail) => dispatch => {
  dispatch(setTaskLoading());
  searchTerm = !searchTerm ? '*' : searchTerm; 
  const serviceUrl = process.env.REACT_APP_TASK_SERVICE_URL;
  const url = `${serviceUrl}/api/task/getTasksByAttacher/${attacherid}/${attacherType}/${searchTerm}/${userEmail}`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_TASKS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_TASKS,
        payload: null
      })
    );
};

// Task loading
export const setTaskLoading = () => {
  return {
    type: TASK_LOADING
  };
};

