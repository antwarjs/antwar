'use strict';
var React = require('react');
var _ = require('lodash');
var paths = require('../paths');
var config = require('config');

module.exports = {
  contextTypes: {
    location: React.PropTypes.object
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
  }
};
