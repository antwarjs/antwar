const _path = require('path');
const _ = require('lodash');
const processPages = require('./process-pages');

function getAllPages(config) {
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
            return parseModules(sectionName, section, paths);
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
}
exports.getAllPages = getAllPages;

function parseModules(sectionName, section, modules) {
  // TODO: handle custom sorting per each parsed section
  const ret = _.map(
    modules.keys(),
    (name) => {
      // Strip ./ and extension
      const fileName = _path.basename(name, _path.extname(name)) || '';
      const trimmedName = _.trimStart(_path.dirname(name), './');

      if (fileName === 'index') {
        return {
          type: 'index',
          fileName,
          file: modules(name),
          layout: parseLayout(section, trimmedName, 'index'),
          section,
          sectionName: trimmedName,
          url: trimmedName ? `/${trimmedName}/` : '/'
        };
      }

      return {
        type: 'page',
        fileName,
        file: modules(name),
        layout: parseLayout(section, trimmedName, 'page'),
        section,
        // XXX: avoid trim?
        sectionName: _.trimStart(sectionName + trimmedName, '/'),
        url: trimmedName ?
          sectionName + trimmedName + '/' + fileName + '/' :
          `/${fileName}/`
      };
    }
  );

  if (_.isFunction(section.custom)) {
    console.log(section.custom);

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

  return (section.sort || (pages => pages))(ret);
}

function parseLayout(section, sectionName, layoutName) {
  return section.paths && section.paths[sectionName].layouts &&
    section.paths[sectionName].layouts && section.paths[sectionName].layouts[layoutName] ?
    section.paths[sectionName].layouts[layoutName]() :
    section.layouts[layoutName]();
}

function getSectionPages(config, sectionName, allPages) {
  const pages = allPages || getAllPages(config);

  if (sectionName === '/') {
    const paths = config.paths['/'].content();

    if (paths.keys) {
      return _.uniq(paths.keys().map(
        k => ({
          url: _.trim(k.split('.')[1], '/')
        })
      ));
    }

    // A custom page
    return [paths];
  }

  return _.filter(
    pages,
    o => o.sectionName === sectionName && o.type === 'page'
  );
}
exports.getSectionPages = getSectionPages;

function getPageForPath(config, path, allPages) {
  const pages = allPages || getAllPages(config);

  // XXXXX: Push this check to react-router definition
  // A path should end in /
  if (path.slice(-1) !== '/') {
    console.warn('getPageForPath - No slash!', path, Object.keys(pages).join(', '));

    return {};
  }

  if (path === '/') {
    return pages['/'] || {};
  }

  const ret = pages[path];

  if (!ret) {
    console.warn('getPageForPath - No match!', path, Object.keys(pages).join(', '));

    return {};
  }

  return ret;
}
exports.getPageForPath = getPageForPath;
