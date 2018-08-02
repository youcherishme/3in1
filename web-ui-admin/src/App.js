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

import ListRepoUser from './modules/admin/components/ListRepoUser';
import EditRepoUser from './modules/admin/components/EditRepoUser';
import AddRepoUser from './modules/admin/components/AddRepoUser';


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


              <Route exact path="/repouser/:id" component={EditRepoUser} />
              <Switch>
                <PrivateRoute exact path="/repouser" component={ListRepoUser} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-repouser"                  
                  component={AddRepoUser}
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
