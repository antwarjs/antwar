const generate = require('./generate');
const moment = require('moment');

// Antwar wrapper
module.exports = function ({ baseUrl, sections }) {
  return {
    extra(pages, config) {
      return {
        'atom.xml': generate({
          baseUrl,
          sections,
          updated: moment().format(),
          pages,
          config
        })
      };
    }
  };
};
