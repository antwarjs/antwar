'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var History = require('history');
var Routes = require('antwar-core/BodyRoutes');

const history = History.createHistory();
const container = document.getElementById('dev-container');

ReactDOM.render(React.createElement(
  Router.Router,
  {
    history: history
  },
  Routes
), container);
