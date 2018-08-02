import axios from 'axios';
import { GET_ERRORS } from '../../common/types';

import {
  GET_COMMENT,
  DELETE_COMMENT,
  GET_COMMENTS,
  COMMENT_LOADING,
} from '../types';

// Get Comment
export const getComment = (id, userEmail) => dispatch => {
  dispatch(setCommentLoading());

  const serviceUrl = process.env.REACT_APP_COMMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/comment/${id}/${userEmail}`; 
  
  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_COMMENT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_COMMENT,
        payload: null
      })
    );
};

// Add comment
export const addComment = (commentData, callback) => dispatch => {
  dispatch(setCommentLoading());
  const serviceUrl = process.env.REACT_APP_COMMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/comment`; 
  
  axios
    .post(url, commentData)
    .then(res =>{
      dispatch({
        type: GET_COMMENT,
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

// Delete Comment
export const deleteComment = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Comment? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_COMMENT_SERVICE_URL;
    const url = `${serviceUrl}/api/comment/${id}/${userEmail}`; 

    axios
    .delete(url)
    .then(res =>{
      console.log('deleteComment');
      console.log(id);
      dispatch({
        type: DELETE_COMMENT,
        payload: id
      });
    })
    .catch(err => {
      console.log('deleteComment err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Get all comments
export const getComments = () => dispatch => {
  dispatch(setCommentLoading());
  const serviceUrl = process.env.REACT_APP_COMMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/comment/all`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        console.log('getComments 444');
        dispatch({
          type: GET_COMMENTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_COMMENTS,
        payload: null
      })
    );
};
// Get getCommentsByAttacher
export const getCommentsByAttacher = (attacherid, attacherType, searchTerm, userEmail) => dispatch => {
  dispatch(setCommentLoading());
  const serviceUrl = process.env.REACT_APP_COMMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/comment/getCommentsByAttacher/${attacherid}/${attacherType}/${searchTerm}/${userEmail}`; 

  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_COMMENTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_COMMENTS,
        payload: null
      })
    );
};

// Comment loading
export const setCommentLoading = () => {
  return {
    type: COMMENT_LOADING
  };
};

