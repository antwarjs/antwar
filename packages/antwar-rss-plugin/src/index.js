const generate = require("./generate");

// Antwar wrapper
module.exports = function({ baseUrl, sections, get }) {
  return {
    extra(pages, config) {
      return {
        "atom.xml": generate({
          baseUrl,
          sections,
          updated: new Date().toString(),
          pages,
          config,
          get
        })
      };
    }
  };
};
