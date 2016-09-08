// ES6 features, JSX
require('babel-register');

const _ = require('lodash');
const appModulePath = require('app-module-path');

appModulePath.addPath('../packages');

const antwar = require('antwar');
const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');
const highlightPlugin = require('antwar-highlight-plugin');

const config = {
  output: 'build',
  title: 'Antwar',
  author: 'Antwar',
  deploy: {
    branch: 'master'
  },
  layout() {
    return require('./layouts/Body');
  },
  style() {
    require('antwar-default-theme/scss/main.scss');
    require('./styles/specific.scss');
    require('./styles/prism.css');
  },
  plugins: [
    rssPlugin({
      baseUrl: 'https://antwarjs.github.io/',
      sections: ['blog']
    }),
    prevnextPlugin(),
    highlightPlugin()
  ],
  paths: {
    '/': {
      path() {
        return require.context('./pages');
      }
    },
    blog: {
      title: 'Blog posts',
      path() {
        return require.context('./posts', true, /^\.\/.*\.md$/);
      },
      draft() {
        return require.context('./drafts', true, /^\.\/.*\.md$/);
      },
      processPage: {
        url(o) {
          if (o.file.url) {
            return o.file.url;
          }

          const page = o.fileName.split('.')[0].split('-').slice(1).join('-');

          return `${o.sectionName}/${page}`;
        }
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex');
        },
        page() {
          return require('./layouts/BlogPage');
        }
      }
    },
    docs: {
      title: 'Documentation',
      path() {
        return require.context('./docs', true, /^\.\/.*\.md$/);
      },
      sort(pages) {
        return _.sortBy(pages, function (page) {
          return page.file.sort;
        });
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex');
        },
        page() {
          return require('./layouts/DocsPage');
        }
      }
    }
  }
};

antwar({
  config,
  env: process.env._npm_lifecycle_event || 'dev'
});
