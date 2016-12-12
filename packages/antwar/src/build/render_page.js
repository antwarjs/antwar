const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Router = require('react-router');
const History = require('history');
const Routes = require('../core/Routes');

module.exports = function (url, cb) {
  const history = History.createMemoryHistory();
  const location = history.createLocation(url);

  Router.match({
    routes: Routes,
    location
  },
  function (error, redirectLocation, renderProps) {
    if (error) {
      return cb(error);
    }

    if (!error && !redirectLocation && !renderProps) {
      return cb(
        new Error(
          `No route matching the current location was found!
          Url: ${url},
          Location: ${JSON.stringify(location, null, 2)}`
        )
      );
    }

    return cb(
      null,
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(Router.RouterContext, renderProps)
      )
    );
  });
};
