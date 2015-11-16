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
      const external = getExternalContent(this.getAllPages(), this.getPathname());
      const page = this.getPage();

      // XXX: tidy up and optimize
      let section = this.getSection();
      section.name = this.getSectionName();
      // allow access to all or just part if needed
      section.pages = this.getSectionPages;

      const pathName = this.getPathname();

      const path = {
        name: pathName,
        prefix: this.getPathPrefix(pathName)
      };

      return (
        <Body
          config={config}
          section={section}
          layoutHooks={layoutHooks}
          page={page}
          path={path}>
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
