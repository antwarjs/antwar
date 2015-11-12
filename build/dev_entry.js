'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var Routes = require('antwar-core/BodyRoutes');

Router.run(Routes, Router.HistoryLocation, function(Handler) {
  const app = document.createElement('div');

  document.body.appendChild(app);

  ReactDOM.render(React.createElement(Handler, {}), app);
});
