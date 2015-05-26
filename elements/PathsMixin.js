'use strict';
var React = require('react');

var paths = require('../paths');


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
  getItem: function() {
    var router = this.context.router;
    var params = router.getCurrentParams();
    var item = params.item;
    var splat = params.splat;

    if(splat) {
      return this.getItemForPath(splat + '/' + item);
    }

    return this.getItemForPath(item);
  },
  getPage: function() {
    var router = this.context.router;

    return this.getPageForPath(router.getCurrentPath().slice(1));
  },
  getItemForPath: function(path) {
    return paths.itemForPath(path);
  },
  getPageForPath: function(path) {
    return paths.pageForPath(path);
  },
  getPageTitle: function() {
    var item = this.getItem();

    if(item && item.title) {
      return item.title;
    }

    var router = this.context.router;
    var routes = router.getCurrentRoutes();

    var routeName = routes[routes.length - 1].name;

    if(routeName) {
      return routeName.replace('/', '');
    }

    return '';
  },
};
