const antwar = require('antwar');
const webpack = require('./webpack.config');
const configuration = require('./antwar.config');

antwar({
  configuration,
  environment: process.env.npm_lifecycle_event,
  webpack
}).catch(function (err) {
  console.error(err); // eslint-disable-line no-console
});
