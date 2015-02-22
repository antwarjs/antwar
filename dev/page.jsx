var React = require('react'),
  Router = require('react-router'),
  Routes = require('../elements/Routes.coffee');

module.exports = function(req) {
  var html;
  Router.run(Routes, req.url,  function (Handler) {
    html =  React.renderToString(React.createElement(Handler, null));
  });
  return html;
};

