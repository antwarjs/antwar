var React = require('react'),
  Router = require('react-router'),
  css = require('../scss/main.scss'),
  Routes = require('../elements/Routes.coffee');

module.exports = function(url) {
  var html;
  Router.run(Routes, url,  function (Handler) {
    html =  React.renderToStaticMarkup(React.createElement(Handler, null));
  });
  return html;
};

