'use strict';
var React = require('react');
var _ = require('lodash');
var paths = require('../paths');
var config = require('config');

module.exports = {
  contextTypes: {
    location: React.PropTypes.object
  },
  getPathPrefix: function(pathName) {
    return pathName.split('/').map(function() {
      return '';
    }).join('../');
  },
  getAllPages: function() {
    return paths.allPages();
  },
  getSection: function() {
    const sectionName = this.getSectionName() || '/';

    // each page doesn't belong to a section
    // as it may be a section itself
    return config.paths[sectionName] || {};
  },
  getSectionTitle: function() {
    return this.getSection().title || '';
  },
  getSectionPages: function(sectionName) {
    return paths.getSectionPages(sectionName || this.getSectionName());
  },
  getSectionName: function () {
    const page = this.getPage();

    if(page && page.section) {
      return page.section;
    }

    return _.trim(this.context.location.pathname, '/');
  },
  getPage: function() {
    const location = this.context.location;

    return this.getPageForPath(location.pathname);
  },
  getPageForPath: function(path) {
    if(path === 'antwar_devindex') {
      return;
    }

    return paths.pageForPath(path);
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
  }
};
