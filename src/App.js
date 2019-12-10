import React from 'react';
import './assets/App.css';
import Login from "./views/login/login"
import Layout from './views/layout/layout'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route component={Layout}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
