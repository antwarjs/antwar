const generate = require('./generate');
const moment = require('moment');

// Antwar wrapper
module.exports = function (o) {
  return {
    extra: function (pages, config) { // eslint-disable-line object-shorthand
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
