const _path = require('path');
const _ = require('lodash');
const parseLayout = require('./parse-layout');
const parseUrl = require('./parse-url');
const sortSections = require('./sort-sections');

module.exports = function parseModules(sectionName, section, modules) {
  const ret = _.map(
    modules.keys(),
    (name) => {
      // Strip ./ and extension
      const fileName = _path.basename(name, _path.extname(name)) || '';
      const trimmedName = _.trimStart(_path.dirname(name), './');
      const file = modules(name);

      if (fileName === 'index') {
        return {
          type: 'index',
          fileName,
          file,
          layout: parseLayout(section, trimmedName, 'index'),
          section,
          sectionName: trimmedName,
          url: trimmedName ? `/${trimmedName}/` : '/'
        };
      }

      return {
        type: 'page',
        fileName,
        file,
        layout: parseLayout(section, trimmedName, 'page'),
        section,
        // XXX: avoid trim?
        sectionName: _.trimStart(sectionName + trimmedName, '/'),
        url: parseUrl(section, trimmedName, fileName)
      };
    }
  );

  if (_.isFunction(section.custom)) {
    ret.push({
      type: 'custom',
      fileName: '',
      file: {},
      layout: section.custom(),
      section,
      sectionName: '',
      url: sectionName
    });
  }

  return sortSections(section, ret);
};
