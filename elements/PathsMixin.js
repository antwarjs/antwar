'use strict';
var React = require('react');

var paths = require('../paths');
var _ = require('lodash');


module.exports = {
  contextTypes: {
    router: React.PropTypes.func
  },

  getAllItems: function () {
    return paths.allItems();
  },
  getAllPages: function() {
    return paths.getPages();
  },
  getSection: function () {
    let routes = this.context.router.getCurrentRoutes();
    return routes && routes[1] && routes[1].name;
  },
  getSectionItems: function () {
    let section = this.getSection();
    return _.filter(this.getAllItems(), function (item) {
      return item.section == section;
    })
  },
  getItem: function() {
    let router = this.context.router;
    let params = router.getCurrentParams();
    let item = params.item;
    let splat = params.splat;

    if(splat) {
      return this.getItemForPath(splat + '/' + item);
    }

    return this.getItemForPath(item);
  },
  getPage: function() {
    let router = this.context.router;

    return this.getPageForPath(router.getCurrentPath().slice(1));
  },
  getItemForPath: function(path) {
    return paths.itemForPath(path);
  },
  getPageForPath: function(path) {
    return paths.pageForPath(path);
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
