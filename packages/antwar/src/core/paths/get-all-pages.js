const _ = require('lodash');
const parseSectionPages = require('./parse-section-pages');
const transformSections = require('./transform-sections');

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
            return transformSections(
              sectionName,
              section,
              parseSectionPages(sectionName, section, paths)
            );
          }

          console.warn('getAllPages - Section content did not return a require.context!', section);
        }

        if (_.isFunction(section.index)) {
          return [
            {
              type: 'index',
              fileName: sectionName,
              file: {},
              layout: section.index(),
              section,
              url: `/${sectionName}/`
            }
          ];
        }

        if (_.isFunction(section)) {
          return [
            {
              type: 'index',
              fileName: sectionName,
              file: {},
              layout: section(),
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
    pages,
    (o) => {
      ret[o.url] = o;
    }
  );

  return ret;
};
