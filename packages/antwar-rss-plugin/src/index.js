const generate = require('./generate');
const moment = require('moment');

// Antwar wrapper
module.exports = function (o) {
  return {
    extra(pages, config) {
      return {
        'atom.xml': generate(
          o.baseUrl,
          o.sections,
          moment().format(),
          pages,
          config
        )
      };
    }
  };
};
