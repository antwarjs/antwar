'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var config = require('config');
var BodyContent = require('./BodyContent.jsx');

module.exports = (
  <Route>
    {_.keys(config.paths).map(function(k, i) {
      // possible root path needs to be after other paths. else it can match too early
      if(k === '/') {
        return null;
      }

      return [
        <Route key={'root-' + i} component={BodyContent} path={k} />,
      ];
    })}
    <Route key='page-route' component={BodyContent} path=':page/?' />
    <Route key='page-with-nesting-route' component={BodyContent} path='*/:page/?' />
    {config.paths['/'] && <Route key='index-route' component={BodyContent} path='/' />}
  </Route>
);
