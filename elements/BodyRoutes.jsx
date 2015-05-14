'use strict';
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Body = require('theme/Body');
var Post = require('theme/Post');
var MarkdownPage = require('theme/MarkdownPage');
var Blog = require('theme/Blog');

var BodyContent = require('./BodyContent.jsx')(Body);

var config = require('config');
var paths = require('../paths');

// TODO: eliminate in favor of paths config
var blogRoot = config.blogRoot || 'blog';

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

// TODO: expand to work with paths config
var Routes = (
  <Route name='bodyContent' handler={BodyContent}>
    <Route name={'/' + blogRoot} path={'/' + blogRoot + '/?'} handler={Blog}></Route>
    <Route name='post' path={'/' + blogRoot + '/:post'} handler={Post}></Route>
    <Route name='postWithNesting' path={'/' + blogRoot + '/*/:post'} handler={Post}></Route>
    {pageRoutes}
  </Route>
);


module.exports = Routes
