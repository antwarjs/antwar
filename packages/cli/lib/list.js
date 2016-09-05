'use strict';
var Registry = require('npm-registry');

var npm = new Registry({});


module.exports = function(config) {
    var console = config.console;


    return new Promise(function(resolve, reject) {
        npm.packages.keyword('antwar', function(err, data) {
            if(err) {
                return reject(err);
            }

            data.forEach(function(v) {
                console.info('* ' + v.name + ' - ' + v.description);
            });

            resolve();
        });
    });
};
