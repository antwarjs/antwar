module.exports = {
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
