var _ = require('lodash');
var devConfig = require('./webpack.coffee').dev;

module.exports = function(hmrConfig, config) {
    return _.merge({}, devConfig(config), hmrConfig, function(a, b) {
        return _.isArray(a) ? a.concat(b) : undefined;
    });
};
