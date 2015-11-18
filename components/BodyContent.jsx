'use strict';
import React from 'react';
import layoutHooks from '../hooks/layout';
import config from 'config';
import paths from '../paths';

export default React.createClass({
  displayName: 'BodyContent',
  propTypes: {
    location: React.PropTypes.object
  },
  render: function() {
    const allPages = paths.allPages();
    const location = this.props.location;
    const pathname = location.pathname;

    const page = paths.pageForPath(pathname, allPages);
    const sectionName = page && page.section ? page.section : _.trim(location, '/');
    let section = config.paths[sectionName || '/'] || {};
    section.name = sectionName;

    // allow access to all or just part if needed
    section.pages = function(sectionName) {
      return paths.getSectionPages(sectionName || section.name, allPages);
    };

    const props = {
      config,
      section,
      layoutHooks,
      page: page || {},
      location
    };
    const Body = this.getBody(config.layout, pathname, props);
    const sectionLayout = this.getSectionLayout(section, page);

    config.style && config.style();

    const pageComponent = React.createFactory(
      _.isPlainObject(page) || !page ? 'div' : page
    )(props);

    return (
      <Body {...props}>
        {sectionLayout ?
          React.createFactory(sectionLayout)(props, pageComponent) :
          pageComponent}

        {this.renderExternal(allPages, pathname)}
      </Body>
    );
  },
  getBody(layout, pathname, props) {
    if(layout) {
      if(!__DEV__ || pathname === 'antwar_devindex') {
        return layout();
      }
    }
    else {
      console.error('Page is missing layout', props);
    }

    return 'div';
  },
  getSectionLayout(section, page) {
    if(section && section.layouts) {
      return section.layouts[page ? 'page' : 'index']();
    }
  },
  renderExternal(allPages, pathname) {
    return _.map(getExternalContent(allPages, pathname), (Component, i) => {
      if(typeof Component === 'function') {
        return <Component key={i} />;
      }
    });
  }
});

function getExternalContent(paths, pathName) {
  return layoutHooks.bodyContent({
    config: config,
    paths: paths,
    pathName: pathName,
    // starts with a slash, strip it
    currentPath: paths[_.trim(pathName, '/')] || {}
  });
}
