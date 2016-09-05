'use strict';
var generate = require('./generate');
var moment = require('moment');

// Antwar wrapper
module.exports = function(o) {
  return {
    extra: function(paths, config) {
      return {
        'atom.xml': generate(
          o.baseUrl,
          o.sections,
          moment().format(),
          paths.pages,
          config
        )
      };
    }
  };
};
