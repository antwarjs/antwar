'use strict';
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Paths = require('./PathsMixin');
var layoutHooks = require('../layoutHooks');
var config = require('config');


module.exports = function(Body) {
  return React.createClass({
    displayName: 'BodyContent',

    mixins: [Router.State, Paths],

    render: function() {
      const page = this.getItem();
      const sectionName = this.getSectionName();
      const external = getExternalContent(this.getAllItems(), this.getPathname());

      return (
        <Body sectionName={sectionName} page={page}>
          <RouteHandler></RouteHandler>
          {_.map(external, function (Component, i) {
            if (typeof Component === 'function') {
              return <Component key={i} />;
            }
          })}
        </Body>
      );
    },
  });
}

function getExternalContent(paths, pathName) {
  return layoutHooks.bodyContent({
    config: config,
    paths: paths,
    pathName: pathName,
    // starts with a slash, strip it
    currentPath: paths[pathName.slice(1)] || {},
  });
}
