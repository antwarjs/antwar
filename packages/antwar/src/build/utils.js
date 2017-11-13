const assert = require("assert");
const _ = require("lodash");

function calculateRedirects(paths) {
  return [].concat // eslint-disable-line prefer-spread
    .apply(
      [],
      _.map(paths, function(values, path) {
        return _.map(values.redirects, function(v, k) {
          const from = path + "/" + k;

          if (v.startsWith("http")) {
            return {
              from,
              to: v, // don't manipulate at all
            };
          }

          // Redirect to any other section
          if (v[0] === "/") {
            return {
              from,
              to: "/" + v.slice(1), // strip /
            };
          }

          // Redirect to the same section
          return {
            from,
            to: "/" + path + "/" + v,
          };
        }).filter(_.identity);
      })
    );
}

exports.calculateRedirects = calculateRedirects;

// TODO: push to separate tests
assert.deepEqual(
  calculateRedirects({
    foo: {},
    demo: {
      redirects: {
        "same-section": "in-same",
        "different-section": "/demo",
        "different-site": "https://google.com",
      },
    },
  }),
  [
    {
      from: "demo/same-section",
      to: "/demo/in-same",
    },
    {
      from: "demo/different-section",
      to: "/demo",
    },
    {
      from: "demo/different-site",
      to: "https://google.com",
    },
  ]
);
