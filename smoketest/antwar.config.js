module.exports = () => ({
  template: {
    title: 'Smoke test'
  },
  output: 'build',
  layout: () => require('./layouts/Body').default,
  paths: {
    '/': {
      content: () => (
        require.context(
          './loaders/page-loader!./pages',
          true,
          /^\.\/.*\.md$/
        )
      ),
      layouts: {
        index: () => require('./layouts/Index').default,
        page: () => require('./layouts/Page').default
      },
      redirects: {}
    },
    standalone: {
      content() {
        return require('./layouts/Standalone').default;
      }
    }
  }
});
