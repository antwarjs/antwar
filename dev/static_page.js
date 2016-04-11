'use strict';
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Router = require('react-router');
var History = require('history');
var Routes = require('../components/Routes').default;

module.exports = function(url, cb) {
  const history = History.createMemoryHistory();
  const location = history.createLocation(url);

  Router.match({
      routes: Routes,
      location: location
    },
    function(error, redirectLocation, renderProps) {
      if(error) {
        return cb(error);
      }

      if(!error && !redirectLocation && !renderProps) {
        console.warn(url, location);
        return cb(new Error('No route matching the current location was found!'));
      }

      cb(
        null,
        ReactDOMServer.renderToStaticMarkup(<Router.RouterContext {...renderProps} />)
      );
    }
  );
};
