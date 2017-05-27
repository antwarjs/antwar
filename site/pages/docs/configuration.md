---
title: "Configuration"
sort: 1
preview: "Understand configuration, understand Antwar"
---

Just like [webpack](https://webpack.js.org/), the heart of Antwar, also Antwar has been built on top of configuration.

`antwar.config.js` describes how to map your content into a site. It ties layouts to the content and allows you to define custom pages where needed. It's also the place where you maintain possible redirects and attach plugins to the system.

## Example

This is the configuration for this site. If you are used to working with JavaScript, most of this should look familiar.

<!-- EMBED require('!!raw-loader!highlight-loader!../../antwar.config.js') -->
