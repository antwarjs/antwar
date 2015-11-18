'use strict';
var React = require('react');
var _ = require('lodash');
var paths = require('../paths');
var config = require('config');

module.exports = {
  contextTypes: {
    location: React.PropTypes.object
  },
  getSection: function() {
    const sectionName = this.getSectionName() || '/';

    // each page doesn't belong to a section
    // as it may be a section itself
    return config.paths[sectionName] || {};
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

    return paths.pageForPath(location.pathname);
  }
};
