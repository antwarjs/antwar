---
title: "FAQ"
sort: 2
preview: "Frequently Asked Questions"
---

## Does Antwar Support Hot Module Reloading?

Yes.

## How to Process Section Item Dates?

By default Antwar will parse date based on Markdown YAML Headmatter. If that's not enough for you, you can customize the behavior as follows:

```javascript
paths: {
  blog: {
    processItem: {
      date: function(o) {
        // parse date from filename for instance
        return new Date(o.fileName.split('-').slice(0, 3).join('.'));
      }
    }
  }
}
```

## How Can I Create Drafts?

You can achieve this using webpack context:

```javascript
paths: {
  blog: {
    path() {
      const posts = require.context(
        'json-loader!yaml-frontmatter-loader!./posts',
        false,
        /^\.\/.*\.md$/
      );

      if (__DEV__) {
        const drafts = require.context(
          'json-loader!yaml-frontmatter-loader!./drafts',
          false,
          /^\.\/.*\.md$/
        );

        const ret = req => {
          try {
            return posts(req);
          } catch (err) {
            return drafts(req);
          }
        };
        ret.keys = () => posts.keys().concat(drafts.keys());

        return ret;
      }

      return posts;
    }
  }
}
```

## How Can I Attach Custom Metadata to Items?

This can be achieved at `sort` hook. In the following example I load custom order from an external file and then attach some metadata per each item.

```javascript
paths: {
  blog: {
    sort: function(files) {
      return files.map(function(file) {
        file.headerImage = '/images/demo.jpg';

        return file;
      });
    },
}
```

## How Can I Deploy to GitHub Pages?

Antwar works very well with [GitHub Pages](https://pages.github.com/). An easy way to deploy there is to use a package known as [gh-pages](https://www.npmjs.com/package/gh-pages). You can set up a npm script like this:

```json
{
  "scripts": {
    "gh-pages:deploy": "gh-pages -d build",
    ...
  },
  ...
}
```

You can preview the site locally by going to your `build` directory and serving the content through a static server. `serve` works well. Just hit `npm i serve -g` and `serve`. The site will be available through port 3000 by default.

## How Can I Automate Deployment?

You can automate this procedure easily through Travis. See [@domenic's instructions](https://gist.github.com/domenic/ec8b0fc8ab45f39403dd) for one way to achieve this. Adapt as needed.

## How Can I Set Up Your Domain?

First of all you should [set up a CNAME file](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/) to project root. In addition you'll need to configure webpack to copy it over:

```javascript
plugins: [
  new CopyWebpackPlugin([
    {
      from: './CNAME',
      to: './'
    }
  ])
],
```
