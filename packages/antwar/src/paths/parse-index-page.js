module.exports = function parseIndexPage(section, sectionName) {
  return (
    section.paths &&
    section.paths[sectionName] &&
    section.paths[sectionName].index &&
    section.paths[sectionName].index()
  );
};
