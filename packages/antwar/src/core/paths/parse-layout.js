module.exports = function parseLayout(section, sectionName, layoutName) {
  return section.paths && section.paths[sectionName].layouts &&
    section.paths[sectionName].layouts && section.paths[sectionName].layouts[layoutName] ?
    section.paths[sectionName].layouts[layoutName]() :
    section.layouts[layoutName]();
};
