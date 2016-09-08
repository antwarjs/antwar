/* eslint-disable no-console */
const GitHubApi = require('github');
const shell = require('shelljs');
const Download = require('download');
const Registry = require('npm-registry');

const npm = new Registry({});
const github = new GitHubApi({
  version: '3.0.0'
});

module.exports = function (config) {
  const console = config.console;

  console.info('Fetching boilerplate metadata');

  const op = config.latest ? initLatest : initFromNpm;

  return op(config).then(processTarball.bind(null, console, config));
};

function initLatest(config) {
  return new Promise(function (resolve, reject) {
    npm.packages.get(config.boilerplate + '@latest', function (err, data) {
      if (err) {
        return reject(err);
      }
      const meta = data.length && data[0];

      if (!meta) {
        return reject(new Error('Missing boilerplate metadata'));
      }

      const gh = meta.github;

      return github.repos.getArchiveLink({
        user: gh.user,
        repo: gh.repo,
        archive_format: 'tarball',
        ref: 'master'
      }, function (err2, res) {
        if (err2) {
          return reject(err2);
        }

        return resolve(res.meta.location);
      });
    });
  });
}

function initFromNpm(config) {
  return new Promise(function (resolve, reject) {
    npm.packages.get(config.boilerplate + '@latest', function (err, data) {
      if (err) {
        return reject(err);
      }
      const meta = data.length && data[0];

      if (!meta) {
        return reject(new Error('Missing boilerplate metadata'));
      }

      return resolve(meta.dist.tarball);
    });
  });
}

function processTarball(console, config, tarballUrl) {
  const directory = config.output;
  const download = new Download({
    extract: true,
    strip: 1,
    mode: '644'
  }).get(tarballUrl).dest(directory);

  console.info('Downloading boilerplate');

  return new Promise(function (resolve, reject) {
    return download.run(function (err) {
      if (err) {
        return reject(err);
      }

      console.info('Downloaded boilerplate');
      console.info('Installing dependencies');

      shell.cd(directory);
      shell.exec('npm install');

      return resolve();
    });
  });
}
