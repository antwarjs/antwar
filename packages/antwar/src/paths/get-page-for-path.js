module.exports = function getPageForPath(config, path, pages) {
  // XXXXX: Push this check to react-router definition
  // A path should end in /
  if (path.slice(-1) !== '/') {
    console.warn('getPageForPath - No slash!', path, Object.keys(pages).join(', '));

    return {};
  }

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
