module.exports = function parseLayout(section, sectionName) {
  if (section.paths) {
    if (section.paths[sectionName] && section.paths[sectionName].layout) {
      return section.paths[sectionName].layout();
    }
  }

  return section.layout && section.layout();
};
