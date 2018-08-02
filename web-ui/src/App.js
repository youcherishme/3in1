import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './modules/common/utils/setAuthToken';
import { setCurrentUser, logoutUser } from './modules/auth/actions/authActions';

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './modules/common/components/controls/PrivateRoute';

import Navbar from './modules/common/components/layout/Navbar';
import Footer from './modules/common/components/layout/Footer';
import Landing from './modules/common/components/layout/Landing';
import Register from './modules/auth/components/Register';

import Login from './modules/auth/components/Login';
import Test from './modules/auth/components/Test';

import Dashboard from './modules/common/components/layout/Dashboard';

import ListClient from './modules/client/components/ListClient';
import EditClient from './modules/client/components/EditClient';
import AddClient from './modules/client/components/AddClient';

import ListCase from './modules/case/components/ListCase';
import EditCase from './modules/case/components/EditCase';
import AddCase from './modules/case/components/AddCase';

import ListProject from './modules/project/components/ListProject';
import EditProject from './modules/project/components/EditProject';
import AddProject from './modules/project/components/AddProject';

import AddContact from './modules/contact/components/AddContact';
import EditContact from './modules/contact/components/EditContact';

import ListStaff from './modules/staff/components/ListStaff';
import AddStaff from './modules/staff/components/AddStaff';
import EditStaff from './modules/staff/components/EditStaff';

import ListTask from './modules/task/components/ListTask';
import EditTask from './modules/task/components/EditTask';
import AddTask from './modules/task/components/AddTask';

import ListAppointment from './modules/appointment/components/ListAppointment';
import EditAppointment from './modules/appointment/components/EditAppointment';
import AddAppointment from './modules/appointment/components/AddAppointment';

import ListEvent from './modules/event/components/ListEvent';

import AddActivity from './modules/event/components/AddActivity';
import EditActivity from './modules/event/components/EditActivity';

import ListInvoice from './modules/invoice/components/ListInvoice';
import EditInvoice from './modules/invoice/components/EditInvoice';
import AddInvoice from './modules/invoice/components/AddInvoice';

import ListQuotation from './modules/quotation/components/ListQuotation';
import EditQuotation from './modules/quotation/components/EditQuotation';
import AddQuotation from './modules/quotation/components/AddQuotation';

import ListDeliveryOrder from './modules/deliveryOrder/components/ListDeliveryOrder';
import EditDeliveryOrder from './modules/deliveryOrder/components/EditDeliveryOrder';
import AddDeliveryOrder from './modules/deliveryOrder/components/AddDeliveryOrder';

import EditComment from './modules/comment/components/EditComment';
import AddComment from './modules/comment/components/AddComment';

import EditDocument from './modules/document/components/EditDocument';
import AddDocument from './modules/document/components/AddDocument';

import ListRepo from './modules/system/components/ListRepo';
import EditRepo from './modules/system/components/EditRepo';
import AddRepo from './modules/system/components/AddRepo';

import ListRepoUser from './modules/system/components/ListRepoUser';

import NotFound from './modules/common/components/not-found/NotFound';

import './App.css';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/Test" component={Test} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>

              <Route exact path="/client/:id" component={EditClient} />
              <Switch>
                <PrivateRoute exact path="/client" component={ListClient} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-client"
                  component={AddClient}
                />
              </Switch>

              <Route exact path="/case/:id" component={EditCase} />
              <Switch>
                <PrivateRoute exact path="/case" component={ListCase} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-case/:attacherid/:attacherTag/:attacherType"                  
                  component={AddCase}
                />
              </Switch>

              <Route exact path="/project/:id" component={EditProject} />
              <Switch>
                <PrivateRoute exact path="/project" component={ListProject} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-project/:attacherid/:attacherTag/:attacherType"                  
                  component={AddProject}
                />
              </Switch>

              <Route exact path="/task/:id" component={EditTask} />
              <Switch>
                <PrivateRoute exact path="/task" component={ListTask} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-task/:attacherid/:attacherTag/:attacherType"                  
                  component={AddTask}
                />
              </Switch>

              <Route exact path="/appointment/:id" component={EditAppointment} />
              <Switch>
                <PrivateRoute exact path="/appointment" component={ListAppointment} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-appointment/:attacherid/:attacherTag/:attacherType"                  
                  component={AddAppointment}
                />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/event" component={ListEvent} />
              </Switch>

              <Route exact path="/activity/:id" component={EditActivity} />
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-activity"                  
                  component={AddActivity}
                />
              </Switch>

              <Route exact path="/invoice/:id" component={EditInvoice} />
              <Switch>
                <PrivateRoute exact path="/invoice" component={ListInvoice} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-invoice/:attacherid/:attacherTag/:attacherType"                  
                  component={AddInvoice}
                />
              </Switch>

              <Route exact path="/repo/:id" component={EditRepo} />
              <Switch>
                <PrivateRoute exact path="/repo" component={ListRepo} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-repo"                  
                  component={AddRepo}
                />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/repoUser" component={ListRepoUser} />
              </Switch>

              <Route exact path="/quotation/:id" component={EditQuotation} />
              <Switch>
                <PrivateRoute exact path="/quotation" component={ListQuotation} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-quotation/:attacherid/:attacherTag/:attacherType"                  
                  component={AddQuotation}
                />
              </Switch>

              <Route exact path="/deliveryOrder/:id" component={EditDeliveryOrder} />
              <Switch>
                <PrivateRoute exact path="/deliveryOrder" component={ListDeliveryOrder} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-deliveryOrder/:attacherid/:attacherTag/:attacherType"                  
                  component={AddDeliveryOrder}
                />
              </Switch>

              <Route exact path="/staff/:id" component={EditStaff} />
              <Switch>
                <PrivateRoute exact path="/staff" component={ListStaff} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-staff"
                  component={AddStaff}
                />
              </Switch>
              
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-contact/:clientid"
                  component={AddContact}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/contact/:id"
                  component={EditContact}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/add-comment/:attacherid/:attacherType"
                  component={AddComment}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/comment/:id"
                  component={EditComment}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/add-document/:attacherid/:attacherType"
                  component={AddDocument}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/document/:id"
                  component={EditDocument}
                />
              </Switch>

              <Route exact path="/not-found" component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
