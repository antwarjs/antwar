/* eslint-disable no-shadow */
const path = require('path');
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
    return [paths];
  }

  return _.filter(
    pages,
    ({ section, type }) => section === sectionName && type === 'page'
  );
}
exports.getSectionPages = getSectionPages;

function allPages() {
  const sections = _.keys(config.paths);
  let pages = [].concat // eslint-disable-line prefer-spread
    .apply(
      [],
      sections.map((sectionName) => {
        const section = config.paths[sectionName];

        if (_.isFunction(section.path)) {
          const paths = section.path();

          if (paths.keys) {
            return (section.sort || defaultSort)(
              parseModules(sectionName, section, paths)
            );
          }

          // Custom page
          return [
            {
              type: 'custom',
              fileName: sectionName
            }
          ];
        }

        // It is possible a section has only redirects. Better not to warn then.
        if (!section.redirects) {
          console.warn('Section path was not a function!', section.path);
        }

        return null;
      })
    ).filter(_.identity); // Filter out redirects

  pages = pageHooks.preProcessPages(pages);
  pages = _.map(pages, processPage);
  pages = pageHooks.postProcessPages(pages);

  const ret = {};

  _.each(pages, (o) => {
    ret[o.url] = o;
  });

  return ret;
}
exports.allPages = allPages;

function defaultSort(files) {
  return _.sortBy(files, 'date').reverse();
}

function parseModules(sectionName, section, modules) {
  const ret = _.map(
    modules.keys(),
    (name) => {
      // Strip ./ and extension
      const fileName = path.basename(name, path.extname(name)) || '';

      return {
        type: fileName === 'index' ? 'index' : 'page',
        fileName: fileName === 'index' ? '' : fileName,
        file: modules(name),
        section,
        sectionName: sectionName === '/' ? '' : sectionName
      };
    }
  );

  // If there's no index in a section, generate one
  if (!_.find(ret, { type: 'index' })) {
    ret.push({
      type: 'index',
      fileName: '',
      file: {},
      section,
      sectionName: sectionName === '/' ? '' : sectionName
    });
  }

  return ret;
}

function pageForPath(path, allPaths) {
  const pages = allPaths || allPages();

  // A path should end in /
  if (path.slice(-1) !== '/') {
    console.warn('pageForPath - No slash!', path, allPaths);

    return {};
  }

  if (path === '/') {
    return pages['/'] || {};
  }

  const ret = pages[_.trim(path, '/')] ||
    pages[_.trim(path, '/') + '/'] || // Possible section page
    pages['/' + _.trim(path, '/')]; // Possible root level pages

  if (!ret) {
    console.warn('pageForPath - No match!', path, allPaths);

    return {};
  }

  return ret;
}
exports.pageForPath = pageForPath;

function processPage({
  file = {}, fileName, sectionName, section, type
}) {
  const sectionFunctions = (section && section.processPage) || {};

  const functions = _.assign({
    date({ file }) {
      return file.date || null;
    },
    content({ file }) {
      return file.body;
    },
    preview({ file }) {
      if (file.preview) {
        return file.preview;
      }

      if (file.attributes && file.attributes.preview) {
        return file.attributes.preview;
      }

      return file.body && file.body.slice(0, 100) + '…';
    },
    description({ file }) {
      if (file.attributes) {
        return file.attributes.description || file.attributes.preview || config.description;
      }

      return file.description || file.preview || config.description;
    },
    keywords({ file }) {
      let keywords = file.keywords || config.keywords || [];

      if (file.attributes && file.attributes.keywords) {
        keywords = file.attributes.keywords;
      }

      if (_.isString(keywords)) {
        return keywords.split(',');
      }

      return keywords;
    },
    title({ file }) {
      return file.attributes && file.attributes.title;
    },
    url({ sectionName = '', fileName = '' }) {
      return `${sectionName}/${fileName}`;
    }
  }, siteFunctions, sectionFunctions);

  // If there is no content, no need to run content hook
  const contentHook = functions.content;
  functions.content = ({ file }) => {
    if (file.body) {
      return contentHook({ file });
    }

    return '';
  };

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
  file.type = type; // eslint-disable-line no-param-reassign

  return file;
}
