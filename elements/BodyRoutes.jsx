'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var SiteIndex = require('./SiteIndex.jsx');
var SectionIndex = require('./SectionIndex.jsx');
var Page = require('./Page.jsx');
var config = require('config');
var BodyContent = require('./BodyContent.jsx')();

module.exports = (
  <Route component={BodyContent} path='/'>
    {_.keys(config.paths).map(function(k, i) {
      // possible root path needs to be after other paths. else it can match too early
      if(k === '/') {
        return null;
      }

      return [
        <Route key={'root-' + i} component={SectionIndex} path={k} />,
      ];
    })}
    <Route key='page-route' component={Page} path=':page/?' />
    <Route key='page-with-nesting-route' component={Page} path='*/:page/?' />
    {config.paths['/'] && <Route key='index-route' component={SiteIndex} path='/' />}
  </Route>
);
