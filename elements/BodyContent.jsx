'use strict';
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;


module.exports = function(Body) {
  return React.createClass({

    displayName: 'BodyContent',

    render: function() {
      return <Body>
          <RouteHandler></RouteHandler>
        </Body>
    },
  });
}
