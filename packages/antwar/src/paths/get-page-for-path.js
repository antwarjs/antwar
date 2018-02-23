const _ = require("lodash");

module.exports = function getPageForPath(path, pages) {
  if (path === "/") {
    return pages["/"] || {};
  }

  // Paths don't have trailing slashes so try without
  const ret = pages[path] || pages[_.trimEnd(path, "/")];

  if (!ret) {
    console.warn(
      "getPageForPath - No match!",
      path,
      Object.keys(pages).join(", ")
    );

    return {};
  }

  return ret;
};
