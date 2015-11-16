'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var SiteIndex = require('./SiteIndex.jsx');
var SectionIndex = require('./SectionIndex.jsx');
var Page = require('./Page.jsx');

var config = require('config');
var configHandlers = config.handlers || {};
var Body = configHandlers.body && configHandlers.body();

if(!Body) {
  console.error('Missing config handlers.body()!');
}

var BodyContent = require('./BodyContent.jsx')(Body);

module.exports = (
  <Route name='bodyContent' handler={BodyContent} path='/'>
    {_.keys(config.paths).map(function(k, i) {
      // possible root path needs to be after other paths. else it can match too early
      if(k === '/') {
        return null;
      }

      return [
        <Route key={'root-' + i} name={k} handler={SectionIndex} />,
      ];
    })}
    <Route key='page-route' name='page' path=':page/?' handler={Page} />
    <Route key='page-with-nesting-route' name='pageWithNesting' path='*/:page/?' handler={Page} />
    {config.paths['/'] ?
    <Route key='index-route' name='index' path={'/'} handler={SiteIndex} />
    :
    null}
  </Route>
);
