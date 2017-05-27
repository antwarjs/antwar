const _ = require('lodash');

module.exports = function getSectionPages(config, sectionName, pages) {
  if (sectionName === '/') {
    const paths = config.paths['/'].content();

    if (paths.keys) {
      return _.uniq(paths.keys().map(
        k => ({
          url: _.trim(k.split('.')[1], '/')
        })
      ));
    }

    // An index page
    return [paths];
  }

  return _.filter(
    pages,
    o => o.sectionName === sectionName && o.type === 'page'
  );
};
