'use strict';
var React = require('react');
var Router = require('react-router');
var Routes = require('../elements/Routes.jsx');

module.exports = function(req) {
  var html;

  Router.run(Routes, req.url, function(Handler) {
    html = React.renderToString(React.createElement(Handler, null));
  });

  return html;
};
