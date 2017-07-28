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
      const fileName = _.trimStart(name, './') || '';
      const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
      const layout = parseLayout(section, fileNameWithoutExtension);
      const file = modules(name);

      const nearestSectionName = Object.keys(section.paths || {}).filter(path => (
        fileNameWithoutExtension.startsWith(path)
      )).sort()[0] || sectionName;

      // Render index pages through root
      if (_path.basename(fileNameWithoutExtension).endsWith('index')) {
        return {
          type: 'index',
          fileName,
          file,
          layout,
          section,
          sectionName: nearestSectionName,
          url: fileNameWithoutExtension === 'index' && sectionName === '/' ?
            '/' :
            joinUrl(
              sectionName,
              fileNameWithoutExtension.split('/index').slice(0, -1).join('')
            )
        };
      }

      return {
        type: 'page',
        fileName,
        file,
        layout,
        section,
        sectionName: nearestSectionName,
        url: parseUrl(section, sectionName, fileNameWithoutExtension)
      };
    }
  );

  // Check for index functions within nested sections
  const checkedSections = {};
  const indexPages = _.map(
    Object.keys((section && section.paths) || {}),
    (childSectionName) => {
      const childSection = section && section.paths[childSectionName];
      const indexPage = parseIndexPage(section, childSectionName);

      if (!checkedSections[childSectionName] && indexPage) {
        checkedSections[childSectionName] = true;

        return {
          type: 'index',
          fileName: '',
          file: indexPage, // Function is an object too - important for title/keyword management.
          layout: indexPage,
          section: childSection,
          sectionName: childSectionName,
          url: joinUrl(
            sectionName,
            childSectionName
          )
        };
      }

      return null;
    }
  ).filter(a => a) || [];

  if (_.isFunction(section.index)) {
    const indexPage = section.index();

    ret.push({
      type: 'index',
      fileName: '',
      file: indexPage, // Function is an object too - important for title/keyword management.
      layout: indexPage,
      section,
      sectionName,
      url: sectionName === '/' ? '/' : `/${sectionName}/`
    });
  }

  return ret.concat(indexPages);
};

// XXXXX: consume this from somewhere
function joinUrl(a, b) {
  const trimmedA = _.trim(a, '/');
  const trimmedB = _.trim(b, '/');

  return '/' + _.trim(`${trimmedA}/${trimmedB}`, '/') + '/';
}
