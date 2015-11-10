var path = require('path');

module.exports = function(config) {
  if(config && config.theme && config.theme.name) {
    try {
      // make sure site is in module search paths,
      // otherwise possible theme cannot be found
      module.paths.unshift(path.join(process.cwd(), 'node_modules'));

      return require(path.basename(config.theme.name));
    }
    catch(err) {
      console.error('err', err);
    }
  }

  return {};
}
