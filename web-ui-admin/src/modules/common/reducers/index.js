import { combineReducers } from 'redux';
import authReducer from '../../auth/reducers/authReducer';
import errorReducer from './errorReducers';
import repoReducer from '../../admin/reducers/repoReducer';
import repoUserReducer from '../../admin/reducers/repoUserReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  repo: repoReducer,
  repoUser: repoUserReducer,
});
