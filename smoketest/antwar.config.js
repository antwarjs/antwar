const marked = require('marked');

module.exports = {
  template: {
    title: 'Smoke test'
  },
  output: 'build',
  layout() {
    return require('./layouts/Body').default;
  },
  paths: {
    '/': section(
      'Smoke test',
      function() {
        return require.context(
          'json!yaml-frontmatter!./pages',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),
    api: section(
      'Smoke test',
      function() {
        return require.context(
          'json!yaml-frontmatter!./pages/api',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),
    configuration: section(
      'Smoke test',
      function() {
        return require.context(
          'json!yaml-frontmatter!./pages/configuration',
          false,
          /^\.\/.*\.md$/
        );
      }
    )
  }
};

function section(title, contentCb) {
  return {
    title: 'Smoke test',
    path: function() {
      return contentCb();
    },
    layouts: {
      page() {
        return require('./layouts/Index').default;
      }
    },
    processPage: {
      url(o) {
        return o.sectionName + '/' + o.fileName.split('.')[0];
      },
      content(o) {
        return marked(o.file.__content);
      }
    },
    redirects: {}
  };
}
