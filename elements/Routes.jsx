'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Body = require('theme/Body');
var Post = require('theme/Post');
var MarkdownPage = require('theme/MarkdownPage');
var Blog = require('theme/Blog');

var Layout = require('./Layout.jsx')(Body)

var DevIndex = require('./DevIndex.jsx');
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
var Routes = (
  <Route name='home' title='Home' handler={Layout}>
    <Route name='/antwar_devindex' handler={DevIndex}></Route>
    <Route name='/blog' path='/blog/?' handler={Blog}></Route>
    <Route name='post' path='/blog/:post' handler={Post}></Route>
    {pageRoutes}
  </Route>
);

function isMarkdownFile(page) {
  return page.fileName && page.fileName.indexOf('.md') > -1
}

module.exports = Routes
