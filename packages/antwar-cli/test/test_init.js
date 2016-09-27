const test = require('tape');
const init = require('../src/lib/init');

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

  const result = init(defaultConfig);

  t.equal(result, 'https://registry.npmjs.org/antwar-boilerplate/latest');
});
