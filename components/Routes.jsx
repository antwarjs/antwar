'use strict';
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DevIndex = require('./DevIndex.jsx');
var BodyContent = require('./BodyContent.jsx');
var BodyRoutes = require('./BodyRoutes.jsx');

export default (
  <Route component={BodyContent}>
    <Route path="antwar_devindex" component={DevIndex} />
    {BodyRoutes}
  </Route>
);
