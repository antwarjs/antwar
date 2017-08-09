module.exports = function getPageForPath(path, pages) {
  if (path === "/") {
    return pages["/"] || {};
  }

  const ret = pages[path] || pages[`${path}/`];

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
