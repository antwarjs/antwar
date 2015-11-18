'use strict';
import React from 'react';
import layoutHooks from '../hooks/layout';
import config from 'config';
import paths from '../paths';

module.exports = React.createClass({
  displayName: 'BodyContent',
  propTypes: {
    location: React.PropTypes.object
  },
  render: function() {
    const allPages = paths.allPages();
    const location = this.props.location;
    const external = getExternalContent(
      paths.allPages(),
      location.pathname
    );
    const page = paths.pageForPath(location.pathname);

    const sectionName = page && page.section ? page.section : _.trim(location, '/');
    let section = config.paths[sectionName || '/'] || {};
    section.name = sectionName;

    // allow access to all or just part if needed
    section.pages = function(sectionName) {
      return paths.getSectionPages(sectionName || section.name);
    };

    let sectionLayout;

    if(section && section.layouts) {
      sectionLayout = section.layouts[page ? 'page' : 'index']();
    }

    const props = {
      config,
      section,
      layoutHooks,
      page: page || {},
      location
    };
    const layout = config.layout;
    let Body = 'div';

    if(layout) {
      if(!__DEV__ || location.pathname === 'antwar_devindex') {
        Body = layout();
      }
    }
    else {
      console.error('Page is missing layout', props);
    }

    config.style && config.style();

    const pageComponent = React.createFactory(_.isPlainObject(page) || !page ? 'div' : page)(props);

    return (
      <Body {...props}>
        {sectionLayout ?
          React.createFactory(sectionLayout)(props, pageComponent) :
          pageComponent}

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
