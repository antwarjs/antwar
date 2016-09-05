'use strict';
var fs = require('fs');
var path = require('path');

var recast = require('recast');
var shell = require('shelljs');
var Registry = require('npm-registry');

var _ast = require('./ast');

var npm = new Registry({});


module.exports = function(config) {
    var console = config.console;
    var theme = config.theme;

    console.info('Fetching theme');

    return new Promise(function(resolve, reject) {
        npm.packages.get(theme, function(err) {
            if(err) {
                return reject(err);
            }

            console.info('Downloading theme');
            shell.exec('npm install ' + theme + ' --save');

            console.info('Reading configuration');

            var p = path.join(process.cwd(), 'antwar.config.js');
            fs.readFile(p, {
                encoding: 'utf-8'
            }, function(err, code) {
                if(err) {
                    return reject(err);
                }

                console.info('Replacing theme');

                replaceTheme(code, theme).then(function(code) {
                    console.info('Writing configuration');

                    fs.writeFile(p, code, function(err) {
                        if(err) {
                            return reject(err);
                        }

                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
};

function replaceTheme(code, theme) {
    return new Promise(function(resolve, reject) {
        // XXX: it's not nice that AST gets mutated here...
        var ast = recast.parse(code);

        _ast.find('ExpressionStatement', {
            'value.expression.left.object.name': 'module',
            'value.expression.left.property.name': 'exports',
        }, ast).
            then(_ast.findObjectProperty.bind(null, 'theme')).
            then(_ast.findObjectProperty.bind(null, 'name')).
            then(_ast.modifyValue.bind(null, theme)).
            then(function() {
                resolve(recast.print(ast).code);
            }).
            catch(reject);
    });
}
