const _ = require('lodash');

module.exports = function getSectionPages(config, sectionName, pages) {
  return _.filter(
    pages,
    o => o.sectionName === sectionName && o.type === 'page'
  );
};
