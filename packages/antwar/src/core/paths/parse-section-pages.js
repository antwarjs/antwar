const _path = require('path');
const _ = require('lodash');
const parseLayout = require('./parse-layout');
const parseIndexPage = require('./parse-index-page');
const parseUrl = require('./parse-url');

module.exports = function parseSectionPages(sectionName, section, modules) {
  const moduleKeys = modules.keys();
  const ret = _.map(
    moduleKeys,
    (name) => {
      // Strip ./ and extension
      const fileName = _path.basename(name, _path.extname(name)) || '';
      const trimmedName = _.trimStart(_path.join(sectionName, _path.dirname(name)), './');
      const file = modules(name);

      // Render index pages through root
      if (fileName === 'index') {
        return {
          type: 'index',
          fileName,
          file,
          layout: parseLayout(section, trimmedName),
          section,
          sectionName: trimmedName || '/',
          url: trimmedName ? `/${trimmedName}/` : '/'
        };
      }

      return {
        type: 'page',
        fileName,
        file,
        layout: parseLayout(section, trimmedName),
        section,
        sectionName: trimmedName || '/',
        url: parseUrl(section, trimmedName, fileName)
      };
    }
  );

  // Check for index functions within nested sections
  const checkedSections = {};
  const indexPages = _.map(
    moduleKeys,
    (name) => {
      const trimmedName = _.trimStart(_path.dirname(name), './');
      const indexPage = parseIndexPage(section, trimmedName);

      if (!checkedSections[trimmedName] && indexPage) {
        checkedSections[trimmedName] = true;

        return {
          type: 'index',
          fileName: '',
          file: {},
          layout: indexPage,
          section,
          sectionName: trimmedName,
          url: `/${trimmedName}/`
        };
      }

      return null;
    }
  ).filter(a => a) || [];

  if (_.isFunction(section.index)) {
    ret.push({
      type: 'index',
      fileName: '',
      file: {},
      layout: section.index(),
      section,
      sectionName,
      url: sectionName === '/' ? '/' : `/${sectionName}/`
    });
  }

  return ret.concat(indexPages);
};
