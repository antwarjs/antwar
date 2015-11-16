'use strict';
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var BodyContent = require('./BodyContent.jsx')();
var DevIndex = require('./DevIndex.jsx');
var BodyRoutes = require('./BodyRoutes.jsx');

export default (
  <Route path='home' title='Home' component={BodyContent}>
    <Route path='/antwar_devindex' component={DevIndex}></Route>
    {BodyRoutes}
  </Route>
);
