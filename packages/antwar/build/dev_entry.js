const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const History = require('history');
const Routes = require('../components/Routes').default;

const appHistory = Router.useRouterHistory(History.createHistory)();
const container = document.getElementById('dev-container');

ReactDOM.render(React.createElement(
  Router.Router,
  {
    history: appHistory
  },
  Routes
), container);
