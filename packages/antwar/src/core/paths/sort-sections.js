const _ = require('lodash');

module.exports = function sortSections(sectionName, section, pages) {
  if (section.paths) {
    return _.flatMap(
      _.groupBy(pages, 'sectionName'),
      (pages, name) => {
        // Sort section itself
        if (sectionName === name && section.sort) {
          return section.sort(pages);
        }

        // Use possible subsection sort
        if (section.paths[name] && section.paths[name].sort) {
          return section.paths[name].sort(pages);
        }

        // No sort, return original pages
        return pages;
      }
    );
  }

  if (section.sort) {
    return section.sort(pages);
  }

  return pages;
};
