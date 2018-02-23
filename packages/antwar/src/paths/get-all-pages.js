const _ = require("lodash");
const parseSectionPages = require("./parse-section-pages");
const transformSections = require("./transform-sections");

module.exports = function getAllPages(config) {
  if (!config) {
    return console.error("getAllPages - Missing configuration");
  }

  const sections = _.keys(config.paths);
  const pages = [].concat // eslint-disable-line prefer-spread
    .apply(
      [],
      sections.map(sectionName => {
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

          console.warn(
            "getAllPages - Section content did not return a require.context!",
            section
          );
        }

        if (_.isFunction(section.index)) {
          const indexPage = section.index();

          return [
            {
              type: "index",
              fileName: sectionName,
              // Function is an object too - important for title/keyword management.
              file: indexPage,
              layout: indexPage,
              section,
              url: `/${sectionName}`,
            },
          ];
        }

        if (_.isFunction(section)) {
          const sectionPage = section();

          return [
            {
              type: "index",
              fileName: sectionName,
              file: sectionPage,
              layout: sectionPage,
              section,
              url: sectionName === "/" ? "/" : `/${sectionName}`,
            },
          ];
        }

        console.warn(
          "getAllPages - Section content was not a function!",
          section.content
        );

        return null;
      })
    );

  const ret = {};

  _.each(pages, o => {
    ret[o.url] = o;
  });

  return ret;
};
