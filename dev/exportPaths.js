'use strict';
var paths = require('../paths');
var _ = require('lodash');


module.exports = function() {
    return _.assign({}, paths.allPages(), {
        items: paths.allItems()
    });
};
