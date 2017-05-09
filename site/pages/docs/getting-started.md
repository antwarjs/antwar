---
title: "Getting started"
sort: 0
preview: 'How to download and start using Antwar.'
layout: 'docs'
headerImage: 'https://unsplash.imgix.net/photo-1422513391413-ddd4f2ce3340?q=75&fm=jpg&s=282e5978de17d6cd2280888d16f06f04'
---

Follow these steps to create your antwar site.

1\. Set up a project (`mkdir demo && cd demo && npm init -y`)

2\. Install Antwar core

```
npm i antwar -D
```

3\. Create a bootstrap script

**bootstrap.js**

```
const antwar = require('antwar');

const environment = process.env.npm_lifecycle_event;

// Patch Babel env to make HMR switch work
process.env.BABEL_ENV = environment;

antwar[environment]({
  environment,
  antwar: require('./antwar.config'),
  webpack: require('./webpack.config')
}).catch(function (err) {
  console.error(err);

  process.exit(1);
});
```

4\. Set up scripts to run it

**package.json**

```json
{
  "scripts": {
    "start": "node ./bootstrap.js",
    "build": "node ./bootstrap.js"
  },
  ...
}
```

5\. Set up Antwar and webpack configuration. See [Antwar repository](https://github.com/antwarjs/antwar) (`site/` directory) for reference.

6\. Add initial content and start developing.
