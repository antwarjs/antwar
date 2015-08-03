'use strict';
var React = require('react');

var paths = require('../paths');
var _ = require('lodash');
var config = require('config');


module.exports = {
  contextTypes: {
    router: React.PropTypes.func
  },

  getPathPrefix: function(pathName) {
    return pathName.split('/').map(function() {
      return '';
    }).join('../');
  },

  getAllItems: function () {
    return paths.allItems();
  },
  getSection: function () {
    var sectionName = this.getSectionName();
    var ret = config.paths[sectionName];

    if(!ret) {
      console.warn('Failed to find section ' +  sectionName + ' within ' +
        Object.keys(config.paths).join(', '));

      return {};
    }

    return ret;
  },
  getSectionTitle: function () {
    return this.getSection().title || '';
  },
  getSectionName: function () {
    let item = this.getItem();

    if(item.section) {
      return item.section;
    }

    // strip /
    return this.context.router.getCurrentPath().slice(1);
  },
  getSectionItems: function (sectionName) {
    sectionName = sectionName || this.getSectionName();

    return _.filter(this.getAllItems(), function (item) {
      return item.section == sectionName;
    });
  },
  getItem: function() {
    let router = this.context.router;
    let params = router.getCurrentParams();
    let item = params.item;
    let splat = params.splat;
    if(splat) {
      return this.getItemForPath(splat + '/' + item);
    }

    return this.getItemForPath(item ? item : '/index');
  },
  getItemForPath: function(path) {
    var ret = paths.itemForPath(path);

    if(!ret) {
      console.warn('No item was found for path ' + path + '!');
    }

    return ret;
  },
  getPageTitle: function() {
    let item = this.getItem();

    if(item && item.title) {
      return item.title;
    }

    let router = this.context.router;
    let routes = router.getCurrentRoutes();

    let routeName = routes[routes.length - 1].name;

    if(routeName) {
      return routeName.replace('/', '');
    }

    return '';
  },
};
