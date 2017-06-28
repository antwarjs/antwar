module.exports = () => ({
  template: {
    title: 'Smoke test'
  },
  output: 'build',
  paths: {
    '/': {
      content: () => require.context('./pages', true, /^\.\/.*\.md$/),
      layout: () => require('./layouts/Page').default,
      redirects: {}
    },
    standalone: () => require('./layouts/Standalone').default,
    demo: {
      content: () => require.context('./pages', true, /^\.\/.*\.md$/),
      layout: () => require('./layouts/Page').default,
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`
    }
  }
});
