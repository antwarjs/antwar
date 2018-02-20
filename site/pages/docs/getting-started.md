---
title: "Getting started"
sort: 0
preview: 'How to download and start using Antwar.'
layout: 'docs'
headerImage: 'https://unsplash.imgix.net/photo-1422513391413-ddd4f2ce3340?q=75&fm=jpg&s=282e5978de17d6cd2280888d16f06f04'
---

Follow these steps to create your Antwar site.

1\. Set up a project (`mkdir demo && cd demo && npm init -y`)

2\. Install Antwar core

```bash
npm i antwar -D
```

3\. Create a bootstrap script. This will be used to run the site.

**antwar.bootstrap.js**

<!-- EMBED require('!!raw-loader!highlight-loader!../../../smoketest/antwar.bootstrap.js') -->

4\. Set up scripts to run it

**package.json**

```json
{
  "scripts": {
    "start": "node ./antwar.bootstrap.js develop",
    "build": "node ./antwar.bootstrap.js build"
  },
  ...
}
```

5\. Set up Antwar and webpack configuration. See the documentation and the [Antwar repository](https://github.com/antwarjs/antwar) (`site/` and `smoketest/` directories) for reference.

6\. Add initial content and start developing.
