import { GET_ERRORS, CLEAR_ERRORS, RESET } from '../types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      console.log('common reducer GET_ERRORS', action.payload);
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    case RESET:
    console.log('common reducer RESET');
    
      return initialState; 
    default:
      return state;
  }
}

