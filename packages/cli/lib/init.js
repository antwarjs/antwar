'use strict';
var GitHubApi = require('github');
var shell = require('shelljs');
var Download = require('download');
var Registry = require('npm-registry');

var npm = new Registry({});
var github = new GitHubApi({
    version: '3.0.0',
});

module.exports = function(config) {
    var console = config.console;

    console.info('Fetching boilerplate metadata');

    var op = config.latest ? initLatest : initFromNpm;

    return op(config).then(processTarball.bind(null, console, config));
};

function initLatest(config) {
    return new Promise(function(resolve, reject) {
        npm.packages.get(config.boilerplate + '@latest', function(err, data) {
            if(err) {
                return reject(err);
            }
            var meta = data.length && data[0];

            if(!meta) {
                return reject(new Error('Missing boilerplate metadata'));
            }

            var gh = meta.github;

            github.repos.getArchiveLink({
                user: gh.user,
                repo: gh.repo,
                'archive_format': 'tarball',
                ref: 'master',
            }, function(err, res) {
                if(err) {
                    return reject(err);
                }

                resolve(res.meta.location);
            });
        });
    });
}

function initFromNpm(config) {
    return new Promise(function(resolve, reject) {
        npm.packages.get(config.boilerplate + '@latest', function(err, data) {
            if(err) {
                return reject(err);
            }
            var meta = data.length && data[0];

            if(!meta) {
                return reject(new Error('Missing boilerplate metadata'));
            }

            resolve(meta.dist.tarball);
        });
    });
}

function processTarball(console, config, tarballUrl) {
    var directory = config.output;
    var download = new Download({
        extract: true,
        strip: 1,
        mode: '644'
    }).get(tarballUrl).dest(directory);

    console.info('Downloading boilerplate');

    return new Promise(function(resolve, reject) {
        download.run(function(err) {
            if(err) {
                return reject(err);
            }

            console.info('Downloaded boilerplate');
            console.info('Installing dependencies');

            shell.cd(directory);
            shell.exec('npm install');

            resolve();
        });
    });
}
