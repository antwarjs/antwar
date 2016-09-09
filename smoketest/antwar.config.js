module.exports = {
  output: 'build',
  title: 'Smoketest',
  layout() {
    return require('./layouts/Body');
  },
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
