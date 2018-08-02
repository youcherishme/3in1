import { combineReducers } from 'redux';
import authReducer from '../../auth/reducers/authReducer';
import errorReducer from './errorReducers';
import repoReducer from '../../system/reducers/repoReducer';
import repoUserReducer from '../../system/reducers/repoUserReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  repo: repoReducer,
  repoUser: repoUserReducer,
});
