'use strict';
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Paths = require('./PathsMixin');
var layoutHooks = require('../layoutHooks');
var config = require('config');

var getExternalContent = function (paths, pages) {
  var elements = layoutHooks.bodyContent({
    config: config,
    paths: paths,
    pages: pages
  });

  return elements;
};


module.exports = function(Body) {
  return React.createClass({

    displayName: 'BodyContent',

    mixins: [Router.State, Paths],

    render: function() {
      return <Body>
          <RouteHandler></RouteHandler>
          {_.each(getExternalContent(this.getAllPosts()), function (component) {
            React.createElement(component, null);
          })}
        </Body>
    },
  });
}
