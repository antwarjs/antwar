const _path = require('path');
const _ = require('lodash');
const processPages = require('./process-pages');

function getAllPages(config) {
  const sections = _.keys(config.paths);
  const pages = [].concat // eslint-disable-line prefer-spread
    .apply(
      [],
      sections.map((sectionName) => {
        const section = config.paths[sectionName];

        if (_.isFunction(section.content)) {
          const paths = section.content();

          if (paths.keys) {
            return (section.sort || defaultSort)(
              parseModules(sectionName, section, paths)
            );
          }
        }

        // Custom page
        if (_.isFunction(section.custom)) {
          return [
            {
              type: 'custom',
              fileName: sectionName,
              section,
              url: `/${sectionName}/`
            }
          ];
        }

        // It is possible a section has only redirects. Better not to warn then.
        if (!section.redirects) {
          console.warn('Section content was not a function!', section.content);
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

function defaultSort(files) {
  return _.sortBy(files, 'date').reverse();
}

function parseModules(sectionName, section, modules) {
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
          section,
          sectionName: trimmedName,
          url: trimmedName ? `/${trimmedName}/` : '/'
        };
      }

      return {
        type: 'page',
        fileName,
        file: modules(name),
        section,
        sectionName: sectionName + trimmedName,
        url: trimmedName ?
          sectionName + trimmedName + '/' + fileName + '/' :
          `/${fileName}/`
      };
    }
  );

  // If there's no index in a section, generate one
  // XXX: Does this check make sense anymore?
  if (!_.find(ret, { type: 'index' })) {
    ret.push({
      type: 'index',
      fileName: '',
      file: {},
      section,
      sectionName: sectionName === '/' ? '' : sectionName
    });
  }

  if (_.isFunction(section.custom)) {
    ret.push({
      type: 'custom',
      fileName: '',
      file: {},
      section,
      sectionName: '',
      url: sectionName
    });
  }

  return ret;
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
    ({ section, type }) => section === sectionName && type === 'page'
  );
}
exports.getSectionPages = getSectionPages;

function getPageForPath(config, path, allPages) {
  const pages = allPages || getAllPages(config);

  // XXXXX: Push this check to react-router definition
  // A path should end in /
  if (path.slice(-1) !== '/') {
    console.warn('getPageForPath - No slash!', path, allPages);

    return {};
  }

  if (path === '/') {
    return pages['/'] || {};
  }

  const ret = pages[path];

  if (!ret) {
    console.warn('getPageForPath - No match!', path, allPages);

    return {};
  }

  return ret;
}
exports.getPageForPath = getPageForPath;
