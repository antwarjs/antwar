---
title: "Configuration"
sort: 1
preview: "Understand configuration, understand Antwar"
---

Just like [Webpack](https://webpack.js.org/), the heart of Antwar, also Antwar has been built on the configuration. `antwar.config.js` describes all metadata related to your site. This includes basic information such as site title, author, sections and so on. It also defines which theme and which plugins you use.

## Basic Example

This is (more or less) the configuration for this site. If you are used to working with javascript, most of this should look familiar.

```javascript
const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');
const highlightPlugin = require('antwar-highlight-plugin');

module.exports = {
  // Template settings (each page goes through this)
  template: {
    title: 'Antwar',
    // RSS settings if you want to expose a RSS feed
    rss: {
      title: 'Antwar',
      href: '/atom.xml'
    }
  },

  // Folder name for the output
  output: 'build',

  // Name of the author
  author: 'Antwar',

  plugins: [
    rssPlugin(),
    prevnextPlugin(),

    // Remember to load Prism style in addition to enabling highlighting!
    highlightPlugin()
  ],

  // Definitions for where the content is located
  paths: {
    '/': {
      title: 'Antwar',
      path() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./pages',
          false,
          /^\.\/.*\.md$/
        );
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
      }
    },
    blog: {
      title: 'Blog posts',
      path() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./posts',
          false,
          /^\.\/.*\.md$/
        );
      },
      // XXX: handle drafts in some other way.
      // it's better to provide a control mechanism for
      // filtering content based on metadata
      draft() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./drafts',
          false,
          /^\.\/.*\.md$/
        );
      },
      processPage: {
        url(o) {
          if (o.file.url) {
            return o.file.url;
          }

          const page = o.fileName.split('.')[0].split('-').slice(1).join('-');

          return `${o.sectionName}/${page}`;
        },
        content(o) {
          return marked(o.file.__content);
        }
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex').default;
        },
        page() {
          return require('./layouts/BlogPage').default;
        }
      }
    },
    docs: {
      title: 'Documentation',
      path() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./docs',
          true,
          /^\.\/.*\.md$/
        );
      },
      sort(pages) {
        return _.sortBy(pages, function (page) {
          return page.file.sort;
        });
      },
      processPage: {
        content(o) {
          return marked(o.file.__content);
        }
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex').default;
        },
        page() {
          return require('./layouts/DocsPage').default;
        }
      }
    }
  }
};
```
