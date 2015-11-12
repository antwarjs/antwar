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
  getAllPages: function () {
    return paths.allPages();
  },
  getSection: function () {
    var sectionName = this.getSectionName() || '/';
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
  getSectionPages: function (sectionName) {
    sectionName = sectionName || this.getSectionName();

    return _.filter(this.getAllPages(), function (page) {
      return page.section == sectionName;
    });
  },
  getSectionName: function () {
    const page = this.getPage();

    if(page.section) {
      return page.section;
    }

    // strip /
    return this.context.router.getCurrentPath().slice(1);
  },
  getPage: function() {
    const router = this.context.router;
    const params = router.getCurrentParams();
    const page = params.page;
    const splat = params.splat;

    if(splat) {
      return this.getPageForPath(splat + '/' + page);
    }

    return this.getPageForPath(page ? page : '/index');
  },
  getPageForPath: function(path) {
    const ret = paths.pageForPath(path);

    if(!ret) {
      console.warn('No page was found for path ' + path + '!');

      return {};
    }

    return ret;
  },
  getPageTitle: function() {
    const page = this.getPage();

    if(page && page.title) {
      return page.title;
    }

    const router = this.context.router;
    const routes = router.getCurrentRoutes();

    const routeName = routes[routes.length - 1].name;

    if(routeName) {
      return routeName.replace('/', '');
    }

    return '';
  },
};
