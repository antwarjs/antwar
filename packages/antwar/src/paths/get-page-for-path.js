module.exports = function getPageForPath(config, path, pages) {
  if (path === '/') {
    return pages['/'] || {};
  }

  const ret = pages[path];

  if (!ret) {
    console.warn('getPageForPath - No match!', path, Object.keys(pages).join(', '));

    return {};
  }

  return ret;
};
