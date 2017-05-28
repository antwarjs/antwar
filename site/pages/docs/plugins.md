---
title: "Plugins"
sort: 3
preview: 'Writing plugins for Antwar'
isDraft: true
---

Plugins are useful for generating new pages based on the site structure.

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
