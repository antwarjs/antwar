const antwar = require('antwar');

const configuration = {
  output: 'build',
  title: 'Smoketest',
  paths: {
    '/': {
      path() {
        return require.context(
          'json!yaml-frontmatter!./pages',
          false,
          /^\.\/.*\.md$/
        );
      }
    }
  }
};

antwar({
  configuration,
  environment: process.env._npm_lifecycle_event || 'develop',
  webpack: require('./webpack.config')
}).catch(function (err) {
  console.error(err); // eslint-disable-line no-console
});
