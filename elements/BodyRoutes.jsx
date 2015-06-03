'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Body = require('theme/Body');
var SectionIndex = require('theme/SectionIndex');

var SiteIndex = require('./SiteIndex.jsx');
var BodyContent = require('./BodyContent.jsx')(Body);
var Page = require('./Page.jsx');

var config = require('config');

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
    <Route key='item-route' name='item' path=':item' handler={Page} />
    <Route key='item-with-nesting-route' name='itemWithNesting' path='*/:item' handler={Page} />
    {config.paths['/'] ?
    /* XXX: why //? */
    <Route key='index-route' name='index' path='//' handler={SiteIndex} />
    :
    null}
  </Route>
);
