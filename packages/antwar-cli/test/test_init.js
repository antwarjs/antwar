const tape = require('tape');
const _test = require('tape-promise')
const test = _test(tape);
const lib = require('../src/lib');

test('test npm registry uri', function (t) {
  t.plan(1);

  const defaultConfig = {
    console: {
      info(...args) {
        console.info(args);
      }
    },
    boilerplate: 'antwar-boilerplate'
  };

  return lib.init.executeForTest(defaultConfig).then(function(r) {
    t.equal(r, 'http://registry.npmjs.org/antwar-boilerplate/-/antwar-boilerplate-0.7.1.tgz');
  });
});

test('test github uri', function (t) {
  t.plan(1);

  const defaultConfig = {
    console: {
      info(...args) {
        console.info(args);
      }
    },
    latest: true,
    boilerplate: 'antwar-boilerplate'
  };

  return lib.init.executeForTest(defaultConfig).then(function(r) {
    t.equal(r, 'https://codeload.github.com/antwarjs/boilerplate/legacy.tar.gz/master');
  });
});
