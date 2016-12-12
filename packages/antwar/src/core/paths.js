/* eslint-disable no-shadow */
const _ = require('lodash');
const config = require('config');
const pageHooks = require('./page_hooks')(config);

const siteFunctions = config.functions || {};

function getSectionPages(sectionName, allPaths) {
  const pages = allPaths || allPages();

  if (sectionName === '/') {
    const paths = config.paths['/'].path();

    if (paths.keys) {
      return _.uniq(paths.keys().map(
        k => ({
          url: _.trim(k.split('.')[1], '/')
        })
      ));
    }

    // A custom page
    return paths;
  }

  return _.filter(pages, page => page.section === sectionName);
}
exports.getSectionPages = getSectionPages;

function allPages() {
  const sections = _.keys(config.paths);
  let pages = [].concat // eslint-disable-line prefer-spread
    .apply(
      [],
      sections.map(sectionName => {
        const section = config.paths[sectionName];

        if (_.isFunction(section.path)) {
          const paths = section.path();

          if (paths.keys) {
            return _.identity(
              (section.sort || defaultSort)(
                parseModules(sectionName, section, paths)
              )
            );
          }

          // Custom page
          return {
            name: sectionName,
            sectionName
          };
        }

        console.warn('Section path was not a function!', section.path);

        return null;
      })
    );

  pages = pageHooks.preProcessPages(pages);
  pages = _.map(pages, o => processPage(o.file, o.url, o.name, o.sectionName, o.section));
  pages = pageHooks.postProcessPages(pages);

  const ret = {};

  _.each(pages, o => {
    ret[o.url] = o;
  });

  return ret;
}
exports.allPages = allPages;

function defaultSort(files) {
  return _.sortBy(files, 'date').reverse();
}

function parseModules(sectionName, section, modules) {
  return _.map(modules.keys(), name => ({
    name: name.slice(2),
    file: modules(name),
    section,
    sectionName: sectionName === '/' ? '' : sectionName
  }));
}

function pageForPath(path, allPaths) {
  const pages = allPaths || allPages();

  if (path === '/') {
    return pages['/index'] || {};
  }

  return pages[_.trim(path, '/')] ||
    pages[path] || // middle one is needed by root pages!
    pages[_.trim(path, '/') + '/index'] ||
    {};
}
exports.pageForPath = pageForPath;

function processPage(
  file = {}, url, fileName, sectionName, section
) {
  const sectionFunctions = (section && section.processPage) || {};

  const functions = _.assign({
    date({ file }) {
      return file.date || null;
    },
    content({ file }) {
      return file.__content;
    },
    preview({ file }) {
      if (file.preview) {
        return file.preview;
      }

      return file.__content && file.__content.slice(0, 100) + '…';
    },
    description({ file }) {
      return file.description || file.preview || config.description;
    },
    keywords({ file }) {
      const keywords = file.keywords || config.keywords || [];

      if (_.isString(keywords)) {
        return keywords.split(',');
      }

      return keywords;
    },
    title({ file }) {
      return file.title;
    },
    url({ sectionName, fileName }) {
      const name = fileName ? fileName.split('.')[0].toLowerCase() : '';

      return `${sectionName || ''}/${name}`;
    }
  }, siteFunctions, sectionFunctions);

  _.forEach(functions, (fn, name) => {
    file[name] = fn({ // eslint-disable-line no-param-reassign
      file: file || {},
      fileName,
      sectionName
    });
  });

  // Allow custom extra properties to be set per section
  if (sectionFunctions.extra) {
    file = _.assign(file, sectionFunctions.extra({ // eslint-disable-line no-param-reassign
      file: file || {},
      fileName,
      sectionName
    }));
  }

  file.section = sectionName; // eslint-disable-line no-param-reassign

  return file;
}
