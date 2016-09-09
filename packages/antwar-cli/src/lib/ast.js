/* eslint-disable no-console */
const _ = require('lodash');
const recast = require('recast');

exports.find = function (expr, matches, ast) {
  return new Promise(function (resolve, reject) {
    let resolved = false;
    const o = {};

    o['visit' + expr] = function (path) {
      if (_.every(matches, function (v, k) {
        return resolveObject(path, k) === v;
      })) {
        resolved = true;

        resolve(path);
      }

      return false;
    };

    recast.visit(ast, o);

    if (!resolved) {
      reject();
    }
  });
};

function resolveObject(obj, path) {
  if (!obj) {
    return null;
  }

  return [obj].concat(path.split('.')).reduce(function (prev, cur) {
    if (prev) {
      return prev[cur];
    }

    return null;
  });
}

exports.findObjectProperty = function (name, ast) {
  return new Promise(function (resolve, reject) {
    let resolved = false;

    recast.visit(ast, {
      visitObjectExpression(path) {
        if (path.value && path.value.properties) {
          const properties = path.value.properties;

          properties.forEach(function (property) {
            if (property.key && property.key.name && property.key.name === name) {
              resolved = true;

              resolve(property);
            }
          });
        }

        return false;
      }
    });

    if (!resolved) {
      reject();
    }
  });
};

exports.modifyValue = function (name, ast) {
  return new Promise(function (resolve, reject) {
    if (ast.value && ast.value.value) {
      ast.value.value = name; // eslint-disable-line no-param-reassign

      return resolve();
    }

    return reject();
  });
};
