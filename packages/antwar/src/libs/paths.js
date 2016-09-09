const _ = require('lodash');
const MdHelpers = require('./md_helpers');
const pageHooks = require('./page_hooks');
const config = require('config');

const siteFunctions = config.functions || {};

function getSectionPages(sectionName, allPaths) {
  const pages = allPaths || allPages();

  if (sectionName === '/') {
    return _.uniq(config.paths['/'].path().keys().map(
      function (k) {
        return {
          url: _.trim(k.split('.')[1], '/')
        };
      }
    ));
  }

  return _.filter(pages, function (page) {
    return page.section === sectionName;
  });
}
exports.getSectionPages = getSectionPages;

function allPages() {
  let pages = [].concat // eslint-disable-line prefer-spread
    .apply([], _.keys(config.paths)
    .map(function (sectionName) {
      const section = config.paths[sectionName];
      let paths = [];

      if (_.isFunction(section.path)) {
        paths = parseModules(sectionName, section, section.path());
      }

      let draftPaths = [];
      if (__DEV__ && section.draft) {
        draftPaths = parseModules(
          sectionName, section, section.draft()
        ).map(function (module) {
          module.file.isDraft = true; // eslint-disable-line no-param-reassign

          return module;
        });
      }

      return (section.inject || _.identity)(
        (section.sort || defaultSort)(paths.concat(draftPaths))
      );
    })
  );

  pages = pageHooks.preProcessPages(pages);
  pages = _.map(pages, function (o) {
    return processPage(o.file, o.url, o.name, o.sectionName, o.section);
  });
  pages = pageHooks.postProcessPages(pages);

  const ret = {};

  if (__DEV__) {
    _.each(pages, function (o) {
      ret[o.url] = o;
    });
  } else {
    _.each(pages, function (o) {
      if (!o.isDraft) {
        ret[o.url] = o;
      }
    });
  }

  return ret;
}
exports.allPages = allPages;

function defaultSort(files) {
  return _.sortBy(files, 'date').reverse();
}

function parseModules(sectionName, section, modules) {
  return _.map(modules.keys(), function (name) {
    return {
      name: name.slice(2),
      file: modules(name),
      section,
      sectionName: sectionName === '/' ? '' : sectionName
    };
  });
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

function processPage(file, url, fileName, sectionName, section) {
  const sectionFunctions = section.processPage || {};

  const functions = _.assign({
    isDraft(o) {
      return o.file.isDraft || o.isDraft;
    },
    date(o) {
      return o.file.date || null;
    },
    content(o) {
      return MdHelpers.render(o.file.__content);
    },
    preview(o) {
      const f = o.file;

      if (f.preview) {
        return f.preview;
      }

      return MdHelpers.renderPreview(f.__content, 100, '…');
    },
    description(o) {
      const f = o.file;

      return f.description || f.preview || config.description;
    },
    keywords(o) {
      const f = o.file;
      const keywords = f.keywords || config.keywords || [];

      if (_.isString(keywords)) {
        return keywords.split(',');
      }

      return keywords;
    },
    title(o) {
      return o.file.title;
    },
    url(o) {
      return o.sectionName + '/' + o.fileName.split('.')[0].toLowerCase();
    }
  }, siteFunctions, sectionFunctions);

  _.forEach(functions, function (fn, name) {
    file[name] = fn({ // eslint-disable-line no-param-reassign
      file,
      fileName,
      sectionName
    });
  });

  // allow custom extra properties to be set per section
  if (sectionFunctions.extra) {
    file = _.assign(file, sectionFunctions.extra({ // eslint-disable-line no-param-reassign
      file,
      fileName,
      sectionName
    }));
  }

  file.section = sectionName; // eslint-disable-line no-param-reassign

  return file;
}
