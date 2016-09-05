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

Antwar allows you to mark section items as drafts. This means they will be visible only during development mode and won't be included in the production build. Drafting is useful if you want to set up some content and publish it at a later time.

By default Antwar detects drafts through `isDraft` flag. You can set this at item metadata (ie. YAML headmatter or custom). Alternatively you can tell Antwar to look for drafts in a specific directory. This can be configured as follows.

```javascript
paths: {
  blog: {
    draft: function() {
      // search recursively for Markdown drafts
      return require.context('./drafts', true, /^\.\/.*\.md$/);
    },
```

In this case publishing flow would be simple. You would just move drafts to directory set up in analogous `path` configuration.

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
