const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const History = require('history');
const Routes = require('core/Routes');

const appHistory = Router.useRouterHistory(History.createHistory)();
const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(React.createElement(
  Router.Router,
  {
    history: appHistory
  },
  Routes
), container);
