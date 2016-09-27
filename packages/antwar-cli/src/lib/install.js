const fs = require('fs');
const path = require('path');

const recast = require('recast');
const shell = require('shelljs');
const Registry = require('npm-registry-client');

const baseUri = 'https://registry.npmjs.org/';
const _ast = require('./ast');
const npm = new Registry({});

module.exports = function (config) {
  const console = config.console;
  const theme = config.theme;

  console.info('Fetching theme');

  return new Promise(function (resolve, reject) {
    const uri = baseUri + theme + '/latest';
    npm.get(uri, params, function (err, data) {
      if (err) {
        return reject(err);
      }

      console.info('Downloading theme');
      shell.exec('npm install ' + theme + ' --save');

      console.info('Reading configuration');

      const p = path.join(process.cwd(), 'antwar.config.js');
      fs.readFile(p, {
        encoding: 'utf-8'
      }, function (err2, code) {
        if (err2) {
          return reject(err2);
        }

        console.info('Replacing theme');

        return replaceTheme(code, theme).then(function (code2) {
          console.info('Writing configuration');

          fs.writeFile(p, code2, function (err3) {
            if (err3) {
              return reject(err3);
            }

            return resolve();
          });
        }).catch(reject);
      });

      return null;
    });
  });
};

function replaceTheme(code, theme) {
  return new Promise(function (resolve, reject) {
    // XXX: it's not nice that AST gets mutated here...
    const ast = recast.parse(code);

    _ast.find('ExpressionStatement', {
      'value.expression.left.object.name': 'module',
      'value.expression.left.property.name': 'exports'
    }, ast)
      .then(_ast.findObjectProperty.bind(null, 'theme'))
      .then(_ast.findObjectProperty.bind(null, 'name'))
      .then(_ast.modifyValue.bind(null, theme))
      .then(function () {
        resolve(recast.print(ast).code);
      })
      .catch(reject);
  });
}
