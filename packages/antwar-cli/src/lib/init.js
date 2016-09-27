const GitHubApi = require('github');
const shell = require('shelljs');
const Download = require('download');
const Registry = require('npm-registry-client');

const npm = new Registry({});
const baseUri = 'https://registry.npmjs.org/';
const params = {
  timeout: 1000
};
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
    const uri = baseUri + config.boilerplate + '/latest';
    npm.get(uri, params, function (err, data) {
      if (err) {
        return reject(err);
      }

      if (!data.repository || !data.repository.url) {
        return reject(new Error('Missing boilerplate metadata'));
      }

      const gh = parseGitUri(data.repository.url);

      return github.repos.getArchiveLink({
        user: gh.user,
        repo: gh.repo,
        archive_format: 'tarball',
        ref: 'master'
      }, function (err2, res2) {
        if (err2) {
          return reject(err2);
        }

        return resolve(res2.meta.location);
      });
    });
  });
}

function initFromNpm(config) {
  return new Promise(function (resolve, reject) {
    const uri = baseUri + config.boilerplate + '/latest';
    npm.get(uri, params, function (err, data) {
      if (err) {
        return reject(err);
      }

      if (!data.dist || !data.dist.tarball) {
        return reject(new Error('Missing boilerplate metadata'));
      }

      return resolve(data.dist.tarball);
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

function parseGitUri(uri) {
  const parts = uri.replace('.git', '').split('/');

  return {
    repo: parts[parts.length - 1],
    user: parts[parts.length - 2]
  };
}
