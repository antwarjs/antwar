'use strict';
var paths = require('../paths');


module.exports = function() {
    return {
        items: paths.allItems()
    };
};
