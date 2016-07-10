'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var History = require('history');
var Routes = require('../components/Routes').default;

const appHistory = Router.useRouterHistory(History.createHistory)()
const container = document.getElementById('dev-container');

ReactDOM.render(React.createElement(
  Router.Router,
  {
    history: appHistory
  },
  Routes
), container);
