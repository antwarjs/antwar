var marked = require('marked'); // eslint-disable-line no-var

module.exports = function (env) {
  console.log('env', env); // eslint-disable-line no-console

  return {
    template: {
      title: 'Smoke test'
    },
    output: 'build',
    layout() {
      return require('./layouts/Body').default;
    },
    paths: {
      '/': section(
        function () {
          return require.context(
            'json-loader!yaml-frontmatter-loader!./pages',
            false,
            /^\.\/.*\.md$/
          );
        }
      ),
      api: section(
        function () {
          return require.context(
            'json-loader!yaml-frontmatter-loader!./pages/api',
            false,
            /^\.\/.*\.md$/
          );
        }
      ),
      configuration: section(
        function () {
          return require.context(
            'json-loader!yaml-frontmatter-loader!./pages/configuration',
            false,
            /^\.\/.*\.md$/
          );
        }
      ),
      standalone: {
        title: 'Standalone test',
        path() {
          return require('./layouts/Standalone').default;
        }
      },
      redirect: {
        redirects: {
          demo: '/standalone/'
        }
      }
    }
  };

  function section(contentCb) {
    return {
      title: 'Section test',
      path() {
        return contentCb();
      },
      layouts: {
        index() {
          return require('./layouts/Index').default;
        },
        page() {
          return require('./layouts/Page').default;
        }
      },
      processPage: {
        content(o) {
          return marked(o.file.body);
        }
      },
      redirects: {}
    };
  }
};
