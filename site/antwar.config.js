const _ = require('lodash');
const moment = require('moment');
const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');

module.exports = {
  template: {
    title: 'Antwar',
    rss: {
      title: 'Antwar',
      href: '/atom.xml'
    }
  },
  output: 'build',
  author: 'Antwar',
  layout: () => require('./layouts/SiteBody').default,
  plugins: [
    rssPlugin({
      baseUrl: 'https://antwar.js.org/',
      sections: ['blog'],
      get: {
        content: page => page.file.body,
        date: page => (
          moment(page.file.attributes.date).utcOffset(0).format()
        ),
        title: page => page.file.attributes.title
      }
    }),
    prevnextPlugin()
  ],
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
        index: () => require('./layouts/SectionIndex').default,
        page: () => require('./layouts/Page').default
      },
      custom: () => require('./layouts/SiteIndex').default,
      paths: {
        blog: {
          layouts: {
            page: () => require('./layouts/BlogPage').default
          },
          sort: pages => _.sortBy(pages, 'date').reverse(),
          url: ({ sectionName, fileName }) => (
            `/${sectionName}/${_.trimStart(fileName, '0123456789-')}/`
          )
        },
        docs: {
          layouts: {
            page: () => require('./layouts/DocsPage').default
          },
          sort: pages => (
            _.sortBy(pages, page => page.file.attributes.sort)
          )
        }
      }
    }
  }
};
