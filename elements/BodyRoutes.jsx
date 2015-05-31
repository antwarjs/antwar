'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Body = require('theme/Body');
var SectionItem = require('theme/SectionItem');
var SectionIndex = require('theme/SectionIndex');

var SiteIndex = require('./SiteIndex.jsx');
var BodyContent = require('./BodyContent.jsx')(Body);

var config = require('config');

module.exports = (
  <Route name='bodyContent' handler={BodyContent} path='/'>
    {[].concat.apply([], _.keys(config.paths).map(function(k, i) {
      var handler = SectionIndex;

      if(k === '/') {
        handler = SiteIndex;
      }

      return [
        <Route key={'root-' + i} name={k} path={k} handler={handler}></Route>,
      ];
    }))}
    <Route key={'item-route'} name='item' path={':item'} handler={SectionItem}></Route>
    <Route key={'item-with-nesting-route'} name='itemWithNesting' path={'*/:item'} handler={SectionItem}></Route>
  </Route>
);
