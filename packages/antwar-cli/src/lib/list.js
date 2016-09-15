const Registry = require('npm-registry');

const npm = new Registry({});

module.exports = function (config) {
  const console = config.console;

  return new Promise(function (resolve, reject) {
    npm.packages.keyword('antwar', function (err, data) {
      if (err) {
        return reject(err);
      }

      data.forEach(function (v) {
        console.info('* ' + v.name + ' - ' + v.description);
      });

      return resolve();
    });
  });
};
