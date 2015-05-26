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
      var external = getExternalContent(this.getAllItems(), this.getPathname());
      return (
        <Body>
          <RouteHandler></RouteHandler>
          {_.map(external, function (Component, i) {
            return <Component key={i} />;
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
    currentPath: getCurrentPath(paths, pathName),
  });
}

// TODO: not sure if this is correct yet, might fail
// if sections have resources with the same name!
function getCurrentPath(paths, pathName) {
  var lastPart = pathName.split('/').slice(-1)[0];

  return paths[lastPart];
}
