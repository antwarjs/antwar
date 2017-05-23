---
title: "Plugins"
sort: 3
preview: 'Writing plugins for Antwar'
isDraft: true
---

Plugins are useful for attaching metadata to the page structure (prev/next) or generating new pages (RSS feed).

**Metadata example:**

```javascript
const _ = require('lodash');

module.exports = function () {
  return {
    // Attach prev/next data to pages
    processPages: function generatePrevNext(pages) {
      const len = pages.length;

      return pages.map((page, i) => {
        const previousPage = i > 0 ? pages[i - 1] : {};
        const nextPage = i < len - 1 ? pages[i + 1] : {};
        const ret = _.cloneDeep(page); // Avoid mutation

        ret.previous = previousPage.section === page.section && previousPage;
        ret.next = nextPage.section === page.section && nextPage;

        return ret;
      });
    }
  };
};
```

**RSS example:**

```javascript
const generate = require('./generate');

module.exports = function ({ ... }) {
  return {
    // Attach extra files
    extra(pages, config) {
      return {
        // The value should be a string containing the RSS
        'atom.xml': generate({ ... })
      };
    }
  };
};
```
