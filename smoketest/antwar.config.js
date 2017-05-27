module.exports = () => ({
  template: {
    title: 'Smoke test'
  },
  output: 'build',
  paths: {
    '/': {
      content: () => (
        require.context(
          './loaders/page-loader!./pages',
          true,
          /^\.\/.*\.md$/
        )
      ),
      layout: () => require('./layouts/Page').default,
      redirects: {}
    },
    standalone: {
      index: () => require('./layouts/Standalone').default
    }
  }
});
