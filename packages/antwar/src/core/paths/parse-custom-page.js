module.exports = function parseCustomPage(section, sectionName) {
  return section.paths && section.paths[sectionName] &&
    section.paths[sectionName].custom && section.paths[sectionName].custom();
};
