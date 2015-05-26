'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Body = require('theme/Body');
var SectionItem = require('theme/SectionItem');
var MarkdownPage = require('theme/MarkdownPage');
var SectionIndex = require('theme/SectionIndex');

var BodyContent = require('./BodyContent.jsx')(Body);

var config = require('config');
var paths = require('../paths');

var pageRoutes = _.map(paths.allPages(), function(page, key) {
  var handler = require('pages/' + page.fileName);

  if(isMarkdownFile(page)) {
    handler = MarkdownPage;
  }

  var path = '/';
  if(page.url !== '/') {
    path = '/' + page.url + '/?';
  }

  return <Route path={path} key={page.url} name={page.url} handler={handler}></Route>
});

function isMarkdownFile(page) {
  return page.fileName && page.fileName.indexOf('.md') > -1
}

module.exports = generateRoutes();

function generateRoutes() {
  return (
    <Route name='bodyContent' handler={BodyContent}>
      {[].concat.apply([], _.keys(config.paths).map(function(k, i) {
        return [
          <Route key={'root-' + i} name={k} path={'/' + k + '/?'} handler={SectionIndex}></Route>,
        ];
      }))}
      <Route key={'item-route'} name='item' path={'/:item'} handler={SectionItem}></Route>
      <Route key={'item-with-nesting-route'} name='itemWithNesting' path={'/*/:item'} handler={SectionItem}></Route>
      {pageRoutes}
    </Route>
  );
}
