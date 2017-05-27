const _ = require('lodash');

module.exports = function sortSections(sectionName, section, allPages) {
  if (section.paths) {
    return _.flatMap(
      _.groupBy(allPages, 'sectionName'),
      (groupPages, name) => {
        // Partition index pages from regular ones as those don't need sorting
        const { pages, indices } = partitionPages(groupPages);

        // Sort section itself
        if (sectionName === name && section.sort) {
          return section.sort(pages).concat(indices);
        }

        // Use possible subsection sort
        if (section.paths[name] && section.paths[name].sort) {
          return section.paths[name].sort(pages).concat(indices);
        }

        // No sort, return original pages
        return allPages;
      }
    );
  }

  if (section.sort) {
    const { pages, indices } = partitionPages(allPages);

    return section.sort(pages).concat(indices);
  }

  return allPages;
};

function partitionPages(allPages) {
  // Partition index pages from regular ones as those don't need sorting
  const ret = _.partition(allPages, ({ type }) => type === 'page');

  return {
    pages: ret[0],
    indices: ret[1]
  };
}
