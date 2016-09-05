'use strict';
var ghpages = require('gh-pages');


module.exports = function(config) {
    var conf = config.deploy || {};

    var console = config.console;
    var directory = config.output;
    var branchName = conf.branch || 'gh-pages';

    console.info('Publishing ' + directory + ' to ' + branchName);

    // attach logger so we get some output if we want to
    conf.logger = function(msg) {
        console.info(msg);
    };

    return new Promise(function(resolve, reject) {
        ghpages.clean(); // TODO: eliminate this once it's possible to configure cache dir
        ghpages.publish(directory, conf, function(err) {
            if(err) {
                return reject(err);
            }

            resolve();
        });
    });
};
