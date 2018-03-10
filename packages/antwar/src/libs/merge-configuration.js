const mergeWith = require("lodash/mergeWith");

module.exports = function mergeConfiguration(a, b) {
  return mergeWith({}, a, b, (obj, src) => {
    if (Array.isArray(obj)) {
      return obj.concat(src);
    }

    return undefined;
  });
};
