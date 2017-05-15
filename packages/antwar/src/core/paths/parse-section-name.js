const _ = require('lodash');

module.exports = function parseSectionName(sectionName, name = '') {
  const ret = sectionName + name;

  // Root exception (/)
  return ret.length > 1 ? _.trimStart(ret, '/') : ret;
};
