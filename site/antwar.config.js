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
      layout: () => require('./layouts/Page').default,
      index: () => require('./layouts/SiteIndex').default,
      paths: {
        blog: {
          layout: () => require('./layouts/BlogPage').default,
          index: () => require('./layouts/SectionIndex').default,
          sort: pages => _.sortBy(pages, 'date').reverse(),
          url: ({ sectionName, fileName }) => (
            `/${sectionName}/${_.trimStart(fileName, '0123456789-')}/`
          )
        },
        docs: {
          layout: () => require('./layouts/DocsPage').default,
          index: () => require('./layouts/SectionIndex').default,
          sort: pages => (
            _.sortBy(pages, page => page.file.attributes.sort)
          )
        }
      }
    }
  }
};
