---
title: "Deploying to GitHub Pages"
sort: 3
preview: 'How to deploy to GitHub Pages.'
---

Antwar works very well with [GitHub Pages](https://pages.github.com/). Hosting your site there is simple. Follow the steps below:

1. `git init` at your project directory
2. `git add *`, `git add .gitignore`, `git commit -am "Initial commit"`
3. [Create a repository at GitHub and push the repo there](https://help.github.com/articles/create-a-repo/)
4. `antwar --build` (or `-b` for short)
5. `antwar --deploy` (or `-D` for short)
6. Surf to `<user>.github.io/<project>` and you should see your site there

You can also preview the site locally by going to your `build` directory and serving the content through a static server. `serve` works well. Just hit `npm i serve -g` and `serve`. The site will be available through port 3000 by default.

## Automating Deployment

You can automate this procedure easily through Travis. See [@domenic's instructions](https://gist.github.com/domenic/ec8b0fc8ab45f39403dd) for one way to achieve this. Adapt as needed.

## Setting Up Your Domain

First of all you should [set up a CNAME file](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/) to project root. In addition you'll need to make Antwar to include it with your build through configuration like this:

```javascript
assets: [
  {
    from: './CNAME',
    to: './',
  },
  ...
],
```