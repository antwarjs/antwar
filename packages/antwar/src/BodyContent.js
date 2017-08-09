import React from "react";
import config from "config"; // Aliased through webpack
import _ from "lodash";
import paths from "./paths";

const BodyContent = (page, allPages) => ({ location }) =>
  render({
    section: getSection(page, location.pathname, allPages),
    config,
    page,
    location
  });

function getSection(page, pathname, allPages) {
  const sectionName = page.sectionName;
  const section = config.paths[sectionName || "/"] || config.paths["/"] || {};

  section.name = sectionName;

  // Get all pages of all sections
  section.all = () => getAllSectionPages(allPages);

  // Get pages of the current section or the named one
  section.pages = name =>
    getSectionPages(config, name || sectionName, allPages);

  return section;
}

function getAllSectionPages(allPages) {
  return _.map(config.paths, (path, name) => ({
    url: name,
    path,
    pages: getSectionPages(config, name, allPages)
  }));
}

function getSectionPages(config, name, allPages) {
  return _.filter(
    paths.getSectionPages(config, name, allPages),
    p => p.type === "page"
  );
}

function render(props) {
  let content;

  // TODO: It would be nice to handle redirects here during development
  if (props.page.layout) {
    content = React.createFactory(props.page.layout)(props);
  } else {
    console.error("Trying to render a page with an unknown type", props);
  }

  // XXX: Refactor config level layout out of the system?
  if (props.config.layout) {
    return React.createFactory(props.config.layout())(props, content);
  }

  return content;
}

export default BodyContent;
