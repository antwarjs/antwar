const assert = require('assert');
const _ = require('lodash');

function calculateRedirects(paths) {
  return [].concat // eslint-disable-line prefer-spread
    .apply([], _.map(paths, function (values, path) {
      return _.map(values.redirects, function (v, k) {
        const from = path + '/' + k;

        // Redirect to any other section
        if (v[0] === '/') {
          return {
            from,
            to: v.slice(1) // strip /
          };
        }

        // Redirect to the same section
        return {
          from,
          to: path + '/' + v
        };
      }).filter(_.identity);
    })
    );
}

exports.calculateRedirects = calculateRedirects;

// TODO: push to separate tests
assert.deepEqual(calculateRedirects({
  foo: {},
  demo: {
    redirects: {
      foo: 'bar'
    }
  }
}), [
  {
    from: 'demo/foo',
    to: 'demo/bar'
  }
]);
