'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var config = require('config');
var BodyContent = require('./BodyContent.jsx');

var i = 0;
module.exports = (
  <Route>
    {_.map(config.paths, function(v, k) {
      var pathRoutes = [];

      // generate paths per each page below path
      if(v.path) {
        pathRoutes = getPaths(v.path()).map((p, j) => {
          return <Route
            key={'root-' + i + '-path-' + j}
            component={BodyContent}
            path={p} />
        });
      }

      // possible root path needs to be after other paths. else it can match too early
      if(k === '/') {
        return pathRoutes;
      }

      // XXX: push to zip or something
      i++;

      return pathRoutes.concat([
        <Route key={'root-' + i} component={BodyContent} path={k} />,
      ]);
    })}
    {config.paths['/'] && <Route key='index-route' component={BodyContent} path='/' />}
  </Route>
);

//<Route key='page-route' component={BodyContent} path=':page/?' />
//<Route key='page-with-nesting-route' component={BodyContent} path='*/:page/?' />

function getPaths(req) {
  return req.keys().filter((k) => {
    // skip paths with extensions
    if(k.split('.').length < 3) {
      return k;
    }
  }).map((k) => {
    // get rid of ./
    return k.split('/')[1];
  });
}
