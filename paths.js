'use strict';
var _ = require('lodash');

var MdHelper = require('./components/MdHelper');
var pageHooks = require('./pageHooks');
var config = require('config');
var siteFunctions = config.functions || {} ;

function allPages() {
  var pages = [].concat.apply([], _.keys(config.paths).map(function(sectionName) {
    var section = config.paths[sectionName];

    var paths = parseModules(sectionName, section, section.path());

    var draftPaths = [];
    if(__DEV__ && section.draft) {
      draftPaths = parseModules(sectionName, section, section.draft()).map(function(module) {
        module.file.isDraft = true;

        return module;
      });
    }

    return (section.sort || defaultSort)(paths.concat(draftPaths));
  }));

  pages = pageHooks.preProcessPages(pages);
  pages = _.map(pages, function(o) {
    return processPage(o.file, o.url, o.name, o.sectionName, o.section);
  });
  pages = pageHooks.postProcessPages(pages);

  var ret = {};

  if(__DEV__) {
    _.each(pages, function(o) {
      ret[o.url] = o;
    });
  }
  else {
    _.each(pages, function(o) {
      if(!o.isDraft) {
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
  return _.map(modules.keys(), function(name) {
    return {
      name: name.slice(2),
      file: modules(name),
      section: section,
      sectionName: sectionName === '/' ? '' : sectionName
    };
  });
}

function pageForPath(path) {
  var pages = allPages();

  if(path === '/') {
    return pages['/index'];
  }

  // check both to make root paths work (they have extra /)
  return pages[path] || pages['/' + path];
}
exports.pageForPath = pageForPath;

function processPage(o, url, fileName, sectionName, section) {
  var layout = section.layout;
  var sectionFunctions = section.processPage || {};

  var functions = _.assign({
    isDraft: function(o) {
      return o.file.isDraft || o.isDraft;
    },
    date: function(o) {
      return o.file.date || null;
    },
    content: function(o) {
      return MdHelper.render(o.file.__content);
    },
    preview: function(o) {
      var file = o.file;

      if (file.preview) {
        return file.preview;
      }

      return MdHelper.renderPreview(file.__content, 100, '…');
    },
    description: function(o) {
      var file = o.file;

      return file.description || file.preview || config.description;
    },
    keywords: function(o) {
      var file = o.file;
      var keywords = file.keywords || config.keywords || [];

      if(_.isString(keywords)) {
        return keywords;
      }

      return keywords.join(',');
    },
    title: function(o) {
      return o.file.title;
    },
    url: function(o) {
      return o.sectionName + '/' + o.fileName.split('.')[0].toLowerCase();
    },
    layout: function(o) {
      return layout;
    }
  }, siteFunctions, sectionFunctions);

  _.forEach(functions, function(fn, name) {
    o[name] = fn({
      file: o,
      fileName: fileName,
      sectionName: sectionName
    });
  });

  // allow custom extra properties to be set per section
  if(sectionFunctions.extra) {
    o = _.assign(o, sectionFunctions.extra({
      file: o,
      fileName: fileName,
      sectionName: sectionName
    }));
  }

  o.section = sectionName;

  return o;
}
