import { combineReducers } from 'redux';
import authReducer from '../../auth/reducers/authReducer';
import errorReducer from './errorReducers';
import clientReducer from '../../client/reducers/clientReducer';
import caseReducer from '../../case/reducers/caseReducer';
import projectReducer from '../../project/reducers/projectReducer';
import contactReducer from '../../contact/reducers/contactReducer';
import staffReducer from '../../staff/reducers/staffReducer';
import repoReducer from '../../system/reducers/repoReducer';
import repoUserReducer from '../../system/reducers/repoUserReducer';
import taskReducer from '../../task/reducers/taskReducer';
import appointmentReducer from '../../appointment/reducers/appointmentReducer';
//import eventReducer from '../../event/reducers/eventReducer';
import activityReducer from '../../event/reducers/activityReducer';
import invoiceReducer from '../../invoice/reducers/invoiceReducer';
import quotationReducer from '../../quotation/reducers/quotationReducer';
import deliveryOrderReducer from '../../deliveryOrder/reducers/deliveryOrderReducer';
import commentReducer from '../../comment/reducers/commentReducer';
import documentReducer from '../../document/reducers/documentReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  client: clientReducer,
  contact: contactReducer,
  staff: staffReducer,
  repo: repoReducer,
  repoUser: repoUserReducer,
  task: taskReducer,
  appointment: appointmentReducer,
  //event: eventReducer,
  activity: activityReducer,
  case_: caseReducer,
  project: projectReducer,
  invoice: invoiceReducer,
  quotation: quotationReducer,
  deliveryOrder: deliveryOrderReducer,
  comment: commentReducer,
  document: documentReducer,
});
