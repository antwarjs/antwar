'use strict';
var React = require('react');
var Paths = require('./PathsMixin');
var layoutHooks = require('../layoutHooks');
var config = require('config');
var configLayouts = config.layouts || {};
var Body = configLayouts.body && configLayouts.body();

if(!Body) {
  console.error('Missing config layouts.body!');
}

config.styles && config.styles.body && config.styles.body();

module.exports = React.createClass({
  displayName: 'BodyContent',
  mixins: [Paths],
  render: function() {
    const external = getExternalContent(
      this.getAllPages(),
      this.props.location.pathname
    );
    const page = this.getPage();

    // XXX: tidy up and optimize
    let section = this.getSection();
    section.name = this.getSectionName();
    // allow access to all or just part if needed
    section.pages = this.getSectionPages;

    const pathName = this.props.location.pathname;
    const path = {
      name: pathName,
      prefix: this.getPathPrefix(pathName)
    };
    const props = {
      config,
      section,
      layoutHooks,
      page,
      path
    };

    return (
      <Body {...props}>
        {React.createFactory(page)(props)}
        {_.map(external, function (Component, i) {
          if (typeof Component === 'function') {
            return <Component key={i} />;
          }
        })}
      </Body>
    );
  },
});

function getExternalContent(paths, pathName) {
  return layoutHooks.bodyContent({
    config: config,
    paths: paths,
    pathName: pathName,
    // starts with a slash, strip it
    currentPath: paths[pathName.slice(1)] || {},
  });
}
