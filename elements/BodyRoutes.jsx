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
    {[].concat.apply([], _.keys(config.paths).map(function(k, i) {
      var handler = SectionIndex;
      var path = k;

      if(k === '/') {
        handler = SiteIndex;
        // XXXXX: why is this needed?
        // what triggers "Warning: No route matches path "//". Make sure you have <Route path="//"> somewhere in your routes"
        path = '//';
      }

      return [
        <Route key={'root-' + i} name={k} path={path} handler={handler} />,
      ];
    }))}
    <Route key='item-route' name='item' path={':item'} handler={Page} />
    <Route key='item-with-nesting-route' name='itemWithNesting' path={'*/:item'} handler={Page} />
  </Route>
);
