const _ = require('lodash');
const processPages = require('./process-pages');
const parseSectionPages = require('./parse-section-pages');
const sortSections = require('./sort-sections');

module.exports = function getAllPages(config) {
  if (!config) {
    return console.error('getAllPages - Missing configuration');
  }

  const sections = _.keys(config.paths);
  const pages = [].concat // eslint-disable-line prefer-spread
    .apply(
      [],
      sections.map((sectionName) => {
        const section = config.paths[sectionName];

        if (_.isFunction(section.content)) {
          const paths = section.content();

          if (paths.keys) {
            return sortSections(
              sectionName,
              section,
              parseSectionPages(sectionName, section, paths)
            );
          }

          console.warn('getAllPages - Section content did not return a require.context!', section);
        }

        if (_.isFunction(section.custom)) {
          return [
            {
              type: 'custom',
              fileName: sectionName,
              file: {},
              layout: section.custom(),
              section,
              url: `/${sectionName}/`
            }
          ];
        }

        // It is possible a section has only redirects. Better not to warn then.
        if (!section.redirects) {
          console.warn('getAllPages - Section content was not a function!', section.content);
        }

        return null;
      })
    ).filter(_.identity); // Filter out redirects

  const ret = {};

  _.each(
    processPages(config)(pages),
    (o) => {
      ret[o.url] = o;
    }
  );

  return ret;
};
