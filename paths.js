'use strict';
var _ = require('lodash');
var removeMd = require('remove-markdown');

var themeFunctions = require('theme').functions || {};

var MdHelper = require('./elements/MdHelper');
var itemHooks = require('./itemHooks');
var config = require('config');
var siteFunctions = config.functions || {} ;

function allItems() {
  var items = [].concat.apply([], _.keys(config.paths).map(function(sectionName) {
    var section = config.paths[sectionName];

    var paths = parseModules(sectionName, section, section.path());

    var draftPaths = [];
    if(__DEV__ && section.draft) {
      draftPaths = parseModules(sectionName, section, section.draft()).map(function(module) {
        module.draft = true; // TODO: rename as isDraft to make this clearer

        return module;
      });
    }

    return (section.sort || defaultSort)(paths.concat(draftPaths));
  }));

  items = itemHooks.preProcessItems(items);
  items = _.map(items, function(o) {
    return processItem(o.file, o.url, o.name, o.section, o.sectionName);
  });
  items = itemHooks.postProcessItems(items);

  // TODO: can this conversion be avoided?
  var ret = {};

  _.each(items, function(o) {
    ret[o.url] = o;
  });

  return ret;
}
exports.allItems = allItems;

function defaultSort(files) {
    return _.sortBy(files, 'date').reverse();
}

function parseModules(sectionName, section, modules) {
  return _.map(modules.keys(), function(name) {
    return {
      name: name.slice(2),
      file: modules(name),
      section: section,
      sectionName: sectionName === '/' ? '' : sectionName,
    };
  });
}

function itemForPath(path) {
  var items = allItems();

  // this check is needed for root paths to work (they have extra slash!)
  return items[path] || items['/' + path];
}
exports.itemForPath = itemForPath;

function renderContent(content) {
  return MdHelper.render(content);
}
exports.renderContent = renderContent;

function processItem(o, url, fileName, sectionFunctions, sectionName) {

  var layout = sectionFunctions.layout;

  //XXXXX: Better solution for handling section stuff.

  sectionFunctions = _.without(sectionFunctions, ['path', 'sort', 'layout']);

  var functions = _.assign({
    date: function(file, fileName, sectionName) {
      return file.date || null;
    },
    content: function(file, fileName, sectionName) {
      return MdHelper.render(file.__content);
    },
    preview: function(file, fileName, sectionName) {
      if (file.preview) {
        return file.preview;
      }
      else {
        var previewLimit = 100;

        if(!file.content) {
          return;
        }

        var stripped = removeMd(file.content);

        if (stripped.length > previewLimit) {
          return stripped.substr(0, previewLimit) + '…';
        }

        return stripped;
      }
      return file.preview || MdHelper.getContentPreview(file.__content);
    },
    title: function(file, fileName, sectionName) {
      return file.title;
    },
    url: function(file, fileName, sectionName) {
      return sectionName + '/' + fileName.split('.')[0];
    },
    layout: function(file, fileName, sectionName) {
      return layout;
    },
  }, themeFunctions, siteFunctions, sectionFunctions);

  _.forEach(functions, function(fn, name) {
    o[name] = fn(o, fileName, sectionName);
  });

  o.section = sectionName;

  return o;
}
