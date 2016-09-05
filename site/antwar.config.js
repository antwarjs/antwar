'use strict';
var themeConfig = require('antwar-default-theme');
var rssPlugin = require('antwar-rss-plugin');
var prevnextPlugin = require('antwar-prevnext-plugin');
var highlightPlugin = require('antwar-highlight-plugin');

module.exports = {
  webpack: themeConfig.webpack, // SCSS bits
  output: 'build',
  title: 'Antwar',
  author: 'Antwar',
  deploy: {
    branch: 'master',
  },
  layout: function() {
    return require('./layouts/Body.jsx');
  },
  style: function() {
    require('antwar-default-theme/scss/main.scss');
    require('./styles/specific.scss');
    require('./styles/prism.css');
  },
  plugins: [
    rssPlugin({
      baseUrl: 'https://antwarjs.github.io/',
      sections: ['blog'],
    }),
    prevnextPlugin(),
    highlightPlugin()
  ],
  paths: {
    '/': {
      path: function() {
        return require.context('./pages');
      }
    },
    blog: {
      title: 'Blog posts',
      path: function() {
        return require.context('./posts', true, /^\.\/.*\.md$/);
      },
      draft: function() {
        return require.context('./drafts', true, /^\.\/.*\.md$/);
      },
      processPage: {
        url: function(o) {
          if(o.file.url) {
            return o.file.url;
          }

          var page = o.fileName.split('.')[0].split('-').slice(1).join('-');

          return o.sectionName + '/' + page;
        }
      },
      layouts: {
        index: function() {
          return themeConfig.layouts().SectionIndex;
        },
        page: function() {
          return themeConfig.layouts().BlogPage;
        }
      }
    },
    docs: {
      title: 'Documentation',
      path: function() {
        return require.context('./docs', true, /^\.\/.*\.md$/);
      },
      sort: function (pages) {
        return _.sortBy(pages, function(page) {
          return page.file.sort
        });
      },
      layouts: {
        index: function() {
          return themeConfig.layouts().SectionIndex;
        },
        page: function() {
          return themeConfig.layouts().DocsPage;
        }
      }
    }
  }
};
