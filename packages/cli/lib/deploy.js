/* eslint-disable no-console */
const ghpages = require('gh-pages');

module.exports = function (config) {
  const conf = config.deploy || {};

  const console = config.console;
  const directory = config.output;
  const branchName = conf.branch || 'gh-pages';

  console.info('Publishing ' + directory + ' to ' + branchName);

  // attach logger so we get some output if we want to
  conf.logger = function (msg) {
    console.info(msg);
  };

  return new Promise(function (resolve, reject) {
    ghpages.clean(); // TODO: eliminate this once it's possible to configure cache dir
    ghpages.publish(directory, conf, function (err) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
