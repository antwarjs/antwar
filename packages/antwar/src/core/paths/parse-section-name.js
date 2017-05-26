const _ = require('lodash');

module.exports = function parseSectionName(sectionName, name = '') {
  // Root (/) exception
  if (sectionName === '/' && !name) {
    return sectionName;
  }

  const ret = sectionName + '/' + name;
  const trimmed = _.trim(ret, '/');

  return trimmed.length ? trimmed : ret;
};
