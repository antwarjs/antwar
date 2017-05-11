module.exports = function parseUrl(section, sectionName, fileName) {
  if (section.paths && section.paths[sectionName] && section.paths[sectionName].url) {
    return section.paths[sectionName].url({ sectionName, fileName });
  }

  return sectionName ? `/${sectionName}/${fileName}/` : `/${fileName}/`;
};
