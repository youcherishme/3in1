import { RESET } from '../types';

export const resetStore = () => dispatch => {
  dispatch(
  {
    type: RESET,
    payload: null,
  });
};