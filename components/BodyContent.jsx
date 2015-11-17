'use strict';
import React from 'react';
var Paths = require('../mixins/PathsMixin');
var layoutHooks = require('../hooks/layout');
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

    let section = this.getSection();
    section.name = this.getSectionName();
    // allow access to all or just part if needed
    section.pages = this.getSectionPages;
    let SectionLayout = 'div';

    if(section && section.layouts) {
      SectionLayout = section.layouts[page ? 'page' : 'index']();
    }

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
    let Body = 'div';

    if(layout) {
      if(!__DEV__ || path.name === 'antwar_devindex') {
        Body = layout();
      }
    }
    else {
      console.error('Page is missing layout', props);
    }

    config.style && config.style();

    return (
      <Body {...props}>
        <SectionLayout {...props}>
          {React.isValidElement(page) ? React.createFactory(page)(props) : null}
        </SectionLayout>

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
