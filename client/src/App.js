import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

import store from './store';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/auth';

// Get token
const jwtToken = localStorage.jwtToken;
if (localStorage.jwtToken) {
  // set auth header for all axios request
  setAuthToken(jwtToken);
  // Decode token
  const decoded = jwt_decode(jwtToken);
  store.dispatch(setCurrentUser(decoded));
  // check for token expired
  const currTime = new Date.now() / 1000;
  if (decoded.exp < currTime) {
    store.dispatch(logoutUser());
  }
  // TODO: Clear current profile
  // Redirect user to login
  window.location.href = "/login";
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route path="/" exact component={Landing} />
            <div className="container">
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
