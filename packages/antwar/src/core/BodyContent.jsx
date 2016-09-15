import React from 'react';
import config from 'config';
import _ from 'lodash';
import paths from '../libs/paths';

const BodyContent = ({ location }) => {
  const allPages = paths.allPages();
  const page = paths.pageForPath(location.pathname, allPages);
  const section = getSection(page, location.pathname, allPages);

  return renderSection(
    page,
    { config, section, page, location },
    section
  );
};
BodyContent.propTypes = {
  location: React.PropTypes.object
};

function getSection(page, pathname, allPages) {
  const sectionName = page.section ? page.section : _.trim(pathname, '/');
  const section = config.paths[sectionName || '/'] || config.paths['/'] || {};

  section.title = section.title || sectionName;
  section.name = sectionName;

  // allow access to all or just part if needed
  section.pages = function (name) {
    return paths.getSectionPages(name || sectionName, allPages);
  };

  return section;
}

function renderSection(page, props, section) {
  let content;

  // index doesn't have layouts
  if (!section.layouts) {
    content = renderPage(page, props);
  } else if (_.isEmpty(page)) {
    // sections don't have page metadata
    content = React.createFactory(section.layouts.index())(props);
  } else {
    // ok, got a page now. render it using a page template
    content = React.createFactory(section.layouts.page())(
      props,
      renderPage(page, props)
    );
  }

  if (config.layout) {
    return React.createFactory(config.layout())(
      {},
      content
    );
  }

  return content;
}

function renderPage(page, props) {
  return _.isPlainObject(page) ? 'div' : React.createFactory(page)(props);
}

export default BodyContent;
