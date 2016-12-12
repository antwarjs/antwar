import React from 'react';
import config from 'config';
import _ from 'lodash';
import paths from './paths';

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

  // Get all pages of all sections
  section.all = () => getAllSectionPages(allPages);

  // Get pages of the current section or the named one
  section.pages = (name) => getSectionPages(name || sectionName, allPages);

  return section;
}

function getAllSectionPages(allPages) {
  return _.map(config.paths, (({ title }, name) => ({
    url: name,
    title,
    pages: getSectionPages(name, allPages)
  })));
}

function getSectionPages(name, allPages) {
  return _.filter(
    paths.getSectionPages(name, allPages),
    p => !_.endsWith(p.url, '/index')
  );
}

function renderSection(page, props, section) {
  let content;

  if (page.type === 'index') {
    // Sections don't have page metadata
    content = React.createFactory(
      section.layouts ?
        section.layouts.index() :
        section.path() // Custom page
    )(props);
  } else if (page.type === 'page') {
    // Ok, got a page now. render it using a page template
    content = React.createFactory(
      section.layouts.page()
    )(
      props,
      React.createFactory(page, props)
    );
  } else {
    console.warn('Trying to render a page with an unknown type', page.type, page, props, section);
  }

  if (config.layout) {
    return React.createFactory(config.layout())(
      {},
      content
    );
  }

  return content;
}

export default BodyContent;
