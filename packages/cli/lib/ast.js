'use strict';
var _ = require('lodash');
var recast = require('recast');


exports.find = function(expr, matches, ast) {
    return new Promise(function(resolve, reject) {
        var resolved = false;
        var o = {};

        o['visit' + expr] = function(path) {
            if(_.every(matches, function(v, k) {
                return resolveObject(path, k) === v;
            })) {
                resolved = true;

                resolve(path);
            }

            return false;
        };

        recast.visit(ast, o);

        if(!resolved) {
            reject();
        }
    });
};

function resolveObject(obj, path) {
    if(!obj) {
        return;
    }

    return [obj].concat(path.split('.')).reduce(function(prev, cur) {
        if(prev) {
            return prev[cur];
        }
    });
}

exports.findObjectProperty = function(name, ast) {
    return new Promise(function(resolve, reject) {
        var resolved = false;

        recast.visit(ast, {
            visitObjectExpression: function(path) {
                if(path.value && path.value.properties) {
                    var properties = path.value.properties;

                    properties.forEach(function(property) {
                        if(property.key && property.key.name && property.key.name === name) {
                            resolved = true;

                            resolve(property);
                        }
                    });
                }

                return false;
            },
        });

        if(!resolved) {
            reject();
        }
    });
};

exports.modifyValue = function(name, ast) {
    return new Promise(function(resolve, reject) {
        if(ast.value && ast.value.value) {
            ast.value.value = name;

            resolve();
        }
        else {
            reject();
        }
    });
};
