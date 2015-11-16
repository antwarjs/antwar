'use strict';
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Layout = require('./Layout.jsx');
var DevIndex = require('./DevIndex.jsx');
var BodyRoutes = require('./BodyRoutes.jsx');

// XXXXX: allow custom root layout to be passed
export default (
  <Route name='home' title='Home' handler={Layout}>
    <Route name='/antwar_devindex' handler={DevIndex}></Route>
    {BodyRoutes}
  </Route>
);
