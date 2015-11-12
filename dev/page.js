'use strict';
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Router = require('react-router');
var Routes = require('antwar-core/Routes');

module.exports = function(req) {
  var html;

  Router.run(Routes, req.url, function(Handler) {
    html = ReactDOMServer.renderToString(React.createElement(Handler, null));
  });

  return html;
};
