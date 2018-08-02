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
