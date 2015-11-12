'use strict';
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Router = require('react-router');
var Routes = require('antwar-core/Routes');

module.exports = function(url) {
  var html;

  Router.run(Routes, url, function(Handler) {
    html = ReactDOMServer.renderToStaticMarkup(React.createElement(Handler, null));
  });

  return html;
};
