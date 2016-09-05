---
title: "Configuration"
sort: 3
preview: "Understand configuration, understand Antwar"
---

Just like [Webpack](https://webpack.github.io/), the heart of Antwar, also Antwar has been built on the configuration. `antwar.config.js` describes all metadata related to your site. This includes basic information such as site title, author, sections and so on. It also defines which theme and which plugins you use.

## Basic Example

This is (more or less) the configuration for this site. If you are used to working with javascript, most of this should look familiar.

```javascript
'use strict';

var rssPlugin = require('antwar-rss-plugin');
var prevnextPlugin = require('antwar-prevnext-plugin');
var highlightPlugin = require('antwar-highlight-plugin');

module.exports = {

  // Folder name for the output
  output: 'build',

  // Name of the site
  name: 'Antwar',

  // Name of the author
  author: 'Antwar',

  // Branch to deploy to.
  deploy: {
    branch: 'gh-pages',
  },

  plugins: [
    rssPlugin(),
    prevnextPlugin(),

    // Remember to load Prism style in addition to enabling highlighting!
    highlightPlugin()
  ],

  // Definitions for where the content is located
  paths: {
    '/': {
      path: function() {
        return require.context('./pages');
      }
    },
    blog: {
      path: function() {
        return require.context('./posts', true, /^\.\/.*\.md$/);
      },
      draft: function() {
        return require.context('./drafts', true, /^\.\/.*\.md$/);
      },
      layout: 'blog',
      title: 'Blog posts',
    },
    docs: {
      path: function() {
        return require.context('./docs', true, /^\.\/.*\.md$/);
      },
      sort: function (items) {
        return _.sortBy(items, function (item) {return item.file.sort});
      },
      processItem: {
        isDraft: function(o) {
          return o.file.isDraft;
        },
      },
      layout: 'docs',
      title: 'Documentation',
    }
  },

  // Theme and config for the theme
  theme: {
    name: 'antwar-default-theme',
    navigation: [
      {title: 'Home', url: '/'},
      {title: 'Documentation', url: '/docs'},
      {title: 'Blog', url: '/blog'}
    ],
    analyticsId: 'UA-XXXXXXXXX-1',
    customStyles: 'specific.scss',
  }
};
```

## Advanced Configuration

The configuration is available at page level so you can use it in quite imaginative manners.

To give you a better idea of how to approach configuration consider the real life example below. It has been taken from [SurviveJS](http://survivejs.com/) site and is actually quite advanced example. You don't need anything this complex for a casual blog. The default settings will get you quite far with that.

```javascript
'use strict';
var _ = require('lodash');
var removeMd = require('remove-markdown');
var markdown = require('commonmark');
var highlightPlugin = require('antwar-highlight-plugin');
var prevnextPlugin = require('antwar-prevnext-plugin');

var mdReader = new markdown.Parser();
var mdWriter = new markdown.HtmlRenderer();

module.exports = {
  // copying files so I can refer to them easily from content
  assets: [
    {
      from: 'manuscript/images',
      to: 'images',
    },
    {
      from: './CNAME',
      to: './',
    }
  ],
  // setting up general meta for output and such
  output: 'build',
  name: 'SurviveJS - Survive the jungles of JavaScript',
  author: 'Juho Vepsäläinen',
  deploy: {
    branch: 'gh-pages',
  },
  // global plugins for whole site
  plugins: [
    highlightPlugin({
      style: function() {
        require('highlight.js/styles/github.css');
      },
      languages: ['bash', 'javascript', 'json', 'html'],
    }),
    prevnextPlugin({
      bodyContent: prevnextPlugin.bodyContent({
        previous: function(o) {
          return o.title;
        },
        previousUrl: function(o) {
          return '../' + o.split('/').slice(1).join('/');
        },
        next: function(o) {
          return o.title;
        },
        nextUrl: function(o) {
          return '../' + o.split('/').slice(1).join('/');
        },
      })
    }),
  ],
  // choosing a theme and setting some theme specific settings
  theme: {
    customStyles: 'custom.scss',
    name: 'antwar-default-theme',
    navigation: [
      {title: 'Home', url: '/'},
      {title: 'Table of Contents', url: '/webpack_react'},
    ],
  },
  // describing site structure and content mapping
  paths: {
    '/': {
      path: function() {
        // require.context is a feature of Webpack. It just loads
        // the content of given directory so we can process it
        return require.context('./pages');
      },
    },
    // mapping an ebook (directory of Markdown files) to a section
    webpack_react: {
      title: 'Table of Contents',
      path: function() {
        // here we want just Markdown files. In order to be future proof
        // I get the files recursively (second parameter). This would
        // just generate a deeper structure.
        return require.context('./manuscript', true, /^\.\/.*\.md$/);
      },
      processItem: {
        title: function(o) {
          // picking title from first line (Markdown stripped)
          return removeMd(o.file.__content.split('\n')[0]);
        },
        content: function(o) {
          // picking everything except the first line (title, remember)
          var content = o.file.__content.split('\n').slice(1).join('\n');

          // rendering to html
          return mdWriter.render(mdReader.parse(content));
        },
        preview: function(o) {
          // picking a limited amount of content to show for preview
          var previewLimit = 150;
          var content = o.file.__content.split('\n').slice(1).join('\n');
          var stripped = removeMd(content);

          if(stripped.length > previewLimit) {
            return stripped.substr(0, previewLimit) + '…';
          }

          return stripped;
        },
      },
      sort: function(files) {
        // sorting section index based on an order defined at a separate file
        var order = require('raw!./manuscript/Book.txt').split('\n').filter(id);
        var ret = [];

        order.forEach(function(name) {
          var result = _.findWhere(files, {
            name: name,
          });

          if(result) {
            ret.push(result);
          }
        });

        return ret;
      },
    }
  }
};

function id(a) {return a;}
```

In practice your configuration will likely look very different compared to this example. As you can see, Antwar allows you to shape a section mapping quite freely. The system leverages Webpack heavily.

In addition you may use whatever tricks you have as long as they work in frontend environment. This means you won't have direct access to Node modules such as `fs` but in practice this isn't a problem as Webpack can help you as above.

Each of those `processItem` hooks accepts an object as a parameter. Through it you can access `file` (Webpack context object), `fileName` (string) and `sectionName` (string) data.
