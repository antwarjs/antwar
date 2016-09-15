#!/usr/bin/env node
const path = require('path');
const qs = require('querystring');

const _ = require('lodash');
const simpleTimestamp = require('simple-timestamp');
const Elapsed = require('elapsed');
const antwar = require('antwar');
const chalk = require('chalk');
const program = require('commander');
const upperCaseFirst = require('upper-case-first');
const promiseFinally = require('promise-finally');

require('es6-promise').polyfill();

const lib = require('./lib');
const version = require('./package.json').version;

main();

function main() {
  const prettyConsole = {
    log(...args) {
      console.log(simpleTimestamp(), chalk.green.apply(null, args));
    },
    info(...args) {
      console.info(simpleTimestamp(), chalk.blue.apply(null, args));
    },
    error(...args) {
      console.error(simpleTimestamp(), chalk.bold.red.apply(null, args));
    },
    warn(...args) {
      console.warn(simpleTimestamp(), chalk.yellow.apply(null, args));
    }
  };
  const now = new Date();
  const defaultConfig = {
    webpackConfig: './webpack.config.js',
    blogRoot: 'blog',
    port: 3000,
    output: 'build',
    boilerplate: 'antwar-boilerplate',
    deploy: {
      branch: 'gh-pages'
    },
    console: prettyConsole
  };

  program.version(version)
    .option('-c, --config <file>', 'Path to configuration file ' +
        '(defaults to antwar.config.js) or `site` configuration as a querystring')
    .option('-i, --init <directory>', 'Initialize a project')
    .option('-I --install <theme>', 'Install a theme and attach it to project')
    .option('-p, --plugin <directory>', 'Initialize a plugin')
    .option('-b, --build', 'Build site')
    .option('-l --list', 'List Antwar related packages')
    .option('-s, --serve [port]', 'Serve site. Port (defaults to ' +
        defaultConfig.port + ')', parseInt)
    .option('-D --deploy', 'Deploy to branch (defaults to ' +
        defaultConfig.deploy.branch + ')')
    .option('-d, --develop', 'Open a browser in development mode');

  program.parse(process.argv);

    // TODO: this would be a good place to validate configuration (push to core)
    // + show warnings about possible misspellings etc.
  let config = defaultConfig;

    // do not try to get antwar configuration when initializing a new project
  if (!program.init) {
    config = getConfig(
            defaultConfig,
            program.config
        );
  }

  config.port = parseInt(program.serve, 10) || config.port;
  config.output = program.init || program.plugin || config.output;

    // XXX: this can probably be merged somehow (map?)
  if (program.init) {
    execute(config.console, now, 'project initialization', lib.init, config, function () {
      config.console.info(
                'Go to `' + config.output +
                '` and hit `npm start` to get started'
            );
    });
  } else if (program.install) {
    config.theme = program.install;

    execute(config.console, now, 'installing', lib.install, config);
  } else if (program.plugin) {
    config.boilerplate = 'antwar-plugin-boilerplate';

    execute(config.console, now, 'plugin initialization', lib.init, config);
  } else if (program.build) {
    execute(config.console, now, 'building', antwar.build, config);
  } else if (program.serve) {
    execute(config.console, now, 'serving', lib.serve, config);
  } else if (program.list) {
    execute(config.console, now, 'listing', lib.list, config);
  } else if (program.deploy) {
    execute(config.console, now, 'deployment', lib.deploy, config);
  } else if (program.develop) {
    execute(config.console, now, 'developing', antwar.develop, config);
  } else if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

function execute(console, startTime, name, command, config, doneCb = noop) {
  const upperCasedName = upperCaseFirst(name);

  console.log('Start ' + name + '\n');

  const p = command(config).then(function () {
    console.log('\n' + upperCasedName + ' finished');

    doneCb();
  }).catch(function (err) {
    console.error('\n' + upperCasedName + ' failed', err);
  });

  promiseFinally.default(p, function () {
    showElapsedTime(console, startTime);
  });
}

function noop() {}

function showElapsedTime(console, a, b) {
  const elapsedTime = (new Elapsed(a, b || new Date()));

  console.info('\nTime elapsed:', elapsedTime.optimal || elapsedTime.milliSeconds + ' ms');
}

function getConfig(defaultConfig, config) {
  try {
    let loadedConfig = {};

        // priority 1. qs 2. provided path 3. antwar.config.js
        // if nothing of these works, just use defaultConfig instead

        // assume it's a querystring if there's even one =
        // TODO: note that this doesn't parse nested properties (ie. foo.bar=34)
        // it might be nice to support that as well
    if (config && config.indexOf('=') > 0) {
      loadedConfig = qs.parse(config);
    } else {
      try {
        loadedConfig = require(
                    path.join(process.cwd(), program.config || 'antwar.config.js')
                );
      } catch (e) {
        console.error(e);
      }
    }

    return _.merge(defaultConfig, loadedConfig);
  } catch (e) {
    console.error(e);
  }

  return defaultConfig;
}
