const _ = require("lodash");

module.exports = function transformSections(sectionName, section, allPages) {
  if (section.paths) {
    return _.flatMap(_.groupBy(allPages, "sectionName"), (groupPages, name) => {
      // Partition index pages from regular ones as those don't need transforming
      const { pages, indices } = partitionPages(groupPages);

      // Transform section itself
      if (sectionName === name && section.transform) {
        return section.transform(pages).concat(indices);
      }

      // Use possible subsection transform
      if (section.paths[name] && section.paths[name].transform) {
        return section.paths[name].transform(pages).concat(indices);
      }

      // No transform, return group pages
      return groupPages;
    });
  }

  if (section.transform) {
    const { pages, indices } = partitionPages(allPages);

    return section.transform(pages).concat(indices);
  }

  return allPages;
};

function partitionPages(allPages) {
  // Partition index pages from regular ones as those don't need transforming
  const ret = _.partition(allPages, ({ type }) => type === "page");

  return {
    pages: ret[0],
    indices: ret[1]
  };
}
