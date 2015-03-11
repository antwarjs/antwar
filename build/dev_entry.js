'use strict';
var React = require('react');
var Router = require('react-router');
var Routes = require('../elements/Routes');


Router.run(Routes, Router.HistoryLocation, function(Handler) {
  React.render(React.createElement(Handler, {}), document.body);
});
