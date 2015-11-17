'use strict';
var path = require('path');
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
          return (
            <Route
              key={'root-' + i + '-path-' + j}
              component={BodyContent}
              path={k == '/' ? p : k + '/' + p} />
          );
        });
      }

      // possible root path needs to be after other paths. else it can match too early
      if(k === '/') {
        return pathRoutes;
      }

      // XXX: push to zip or something
      i++;

      return pathRoutes.concat([
        <Route key={'root-' + i} component={BodyContent} path={k} />
      ]);
    })}
    {config.paths['/'] && <Route key="index-route" component={BodyContent} path="/" />}
  </Route>
);

function getPaths(req) {
  return _.uniq(req.keys().map((k) => {
    return _.trim(k.split('.')[1], '/');
  }));
}
