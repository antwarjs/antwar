'use strict';
var React = require('react');
var _ = require('lodash');
var paths = require('../paths');
var config = require('config');

module.exports = {
  contextTypes: {
    location: React.PropTypes.object
  },
  getPage: function() {
    const location = this.context.location;

    return paths.pageForPath(location.pathname);
  }
};
