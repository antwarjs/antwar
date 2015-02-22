var _ = require('lodash');
var webpack = require('webpack');
var devConfig = require('./webpack.coffee').dev;

module.exports = function(config) {
    return _.merge({}, devConfig, config, function(a, b) {
        return _.isArray(a) ? a.concat(b) : undefined;
    });
};
