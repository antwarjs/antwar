'use strict';
var path = require('path');
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var config = require('config');
var BodyContent = require('./BodyContent.jsx');
var paths = require('../libs/paths');

var i = 0;
module.exports = (
  <Route>
    {_.map(config.paths, function(v, k) {
      const pathRoutes = paths.getSectionPages(k).map(_.property('url')).map((url, j) => {
        return (
          <Route
            key={'root-' + i + '-path-' + j}
            component={BodyContent}
            path={url} />
        );
      })

      // possible root path needs to be after other paths. else it can match too early
      if(k === '/') {
        return pathRoutes;
      }

      // XXX
      i++;

      return pathRoutes.concat([
        <Route key={'root-' + i} component={BodyContent} path={k} />
      ]);
    })}
    {config.paths['/'] && <Route key="index-route" component={BodyContent} path="/" />}
  </Route>
);
