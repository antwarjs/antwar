const _ = require('lodash');

module.exports = function sortSections(section, pages) {
  if (section.paths) {
    return _.flatMap(
      _.groupBy(pages, 'sectionName'),
      (pages, sectionName) => (
        (section.paths[sectionName] && section.paths[sectionName].sort) || (pages => pages)
      )(pages)
    );
  }

  return pages;
};
