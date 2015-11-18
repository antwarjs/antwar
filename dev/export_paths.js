'use strict';
var paths = require('../libs/paths');

module.exports = function() {
  return {
    pages: paths.allPages()
  };
};
