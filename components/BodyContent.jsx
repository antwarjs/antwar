'use strict';
import React from 'react';
var Paths = require('../mixins/PathsMixin');
var layoutHooks = require('../layoutHooks');
var config = require('config');

module.exports = React.createClass({
  displayName: 'BodyContent',
  mixins: [Paths],
  propTypes: {
    location: React.PropTypes.object
  },
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
      page: page || {},
      path
    };
    const layout = config.layout;
    let Body;

    if(layout) {
      Body = layout && layout();
    }
    else {
      console.error('Page is missing layout', props);

      // XXX: use some dummy Body now
    }

    config.style && config.style();

    return (
      <Body {...props}>
        {page ? React.createFactory(page)(props) : null}
        {_.map(external, function (Component, i) {
          if(typeof Component === 'function') {
            return <Component key={i} />;
          }
        })}
      </Body>
    );
  }
});

function getExternalContent(paths, pathName) {
  return layoutHooks.bodyContent({
    config: config,
    paths: paths,
    pathName: pathName,
    // starts with a slash, strip it
    currentPath: paths[pathName.slice(1)] || {}
  });
}
