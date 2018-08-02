import axios from 'axios';

import { GET_ERRORS } from '../../common/types';

import {
  ADD_DOCUMENT,
  GET_DOCUMENT,
  DELETE_DOCUMENT,
  GET_DOCUMENTS,
  DOCUMENT_LOADING,
  UPLOAD_DOCUMENT,
  UPLOAD_ERRORS,
} from '../types';

// Get Document
export const getDocument = (id, userEmail) => dispatch => {
  dispatch(setDocumentLoading());

  const serviceUrl = process.env.REACT_APP_DOCUMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/document/${id}/${userEmail}`; 
  
  axios
    .get(url)
    .then(res =>{
      dispatch({
        type: GET_DOCUMENT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_DOCUMENT,
        payload: null
      })
    );
};

// Add document
export const addDocument = (documentData, callback) => dispatch => {
  dispatch(setDocumentLoading());
  const serviceUrl = process.env.REACT_APP_DOCUMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/document`; 
  
  axios
    .post(url, documentData)
    .then(res =>{
      dispatch({
        type: ADD_DOCUMENT,
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

// Delete Document
export const deleteDocument = (id, userEmail) => dispatch => {
  var answer = window.confirm('Are you sure to delete this Document? This can NOT be undone!');
  if(!answer)
    return;  
  
    const serviceUrl = process.env.REACT_APP_DOCUMENT_SERVICE_URL;
    const url = `${serviceUrl}/api/document/${id}/${userEmail}`; 

    axios
    .delete(url)
    .then(res =>{
      console.log('deleteDocument');
      console.log(id);
      dispatch({
        type: DELETE_DOCUMENT,
        payload: id
      });
    })
    .catch(err => {
      console.log('deleteDocument err');
      console.log(err);
      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
    );
};

// Get all documents
export const getDocuments = () => dispatch => {
  dispatch(setDocumentLoading());
  const serviceUrl = process.env.REACT_APP_DOCUMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/document/all`; 
  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        console.log('getDocuments 444');
        dispatch({
          type: GET_DOCUMENTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_DOCUMENTS,
        payload: null
      })
    );
};
// Get getDocumentsByAttacher
export const getDocumentsByAttacher = (attacherid, attacherType, searchTerm, userEmail) => dispatch => {
  dispatch(setDocumentLoading());
  const serviceUrl = process.env.REACT_APP_DOCUMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/document/getDocumentsByAttacher/${attacherid}/${attacherType}/${searchTerm}/${userEmail}`; 

  console.log(url);
  axios
    .get(url)
    .then(res =>
      {
        dispatch({
          type: GET_DOCUMENTS,
          payload: res.data
        });  
      }
    )
    .catch(err =>
      dispatch({
        type: GET_DOCUMENTS,
        payload: null
      })
    );
};

export const upload = (formData, callback) => dispatch => {
  const serviceUrl = process.env.REACT_APP_DOCUMENT_SERVICE_URL;
  const url = `${serviceUrl}/api/document/upload`; 

  axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    /*
    dispatch({
      type: UPLOAD_DOCUMENT,
      payload: res.data
    });  
*/
    callback(res.data);
  }).catch(err => {
    console.log(err);
    /*
    dispatch({
      type: UPLOAD_ERRORS,
      payload: err,
    });
    */
});
}

// Document loading
export const setDocumentLoading = () => {
  return {
    type: DOCUMENT_LOADING
  };
};

