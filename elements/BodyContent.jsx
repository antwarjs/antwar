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
      var external = getExternalContent(this.getAllItems());
      return (<Body>
          <RouteHandler></RouteHandler>
          {_.map(external, function (Component, i) {
            return <Component key={i} />;
          })}
        </Body>);
    },
  });
}
