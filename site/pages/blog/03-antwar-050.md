---
title: "Antwar 0.5.0 - Halfway Towards Awesomeness"
date: 2015-06-04
preview: 'Antwar is speeding up towards maturity'
---

Antwar is one of those projects that was born to fill a need. I wanted to port my [Blogspot blog](http://nixtu.info/) to some platform that's more fun to work with. Initially I looked into [Ghost](https://ghost.org/). The fact that it's not static was a big turn off. I wanted my blog over Git.

> During my dabblings with Ghost I did write a migration path in form of [blogger2ghost](https://github.com/bebraw/blogger2ghost), though. Eventually I came upon [Antwar](https://github.com/antwarjs/antwar) and here I am.

Initially Antwar started as a fork of [Brad Denver react-static-site](https://github.com/BradDenver/react-static-site). Early on I wrote a [design document](https://github.com/antwarjs/antwar/wiki/Design) to guide development. Since then the project has mutated a lot and gained a life of its own. I doubt Antwar would exist without Brad's pioneering work.

Andreas was the first to port [his blog](http://eldh.co/) over at Antwar. My requirements are more complex than that and there are still issues like pagination to solve. As a result I have to develop Antwar further till it meets my needs. Incidentally I managed to find a smaller case that allowed me to work towards this larger goal.

## SurviveJS - Webpack and React

<img src="/assets/img/survivejs.jpg" class="inline-img" alt="SurviveJS site">

[SurviveJS - Webpack and React](http://survivejs.com/) is a little book I have been working on lately. No book is complete without a little site to accompany it. In this case I wanted to offer people an easy way to consume the content online and optionally buy an electronic copy (**wink wink, nudge nudge**).

I realized Antwar could allow me to reach this goal with a bit of work. As I like the design work Andreas has done on the default theme of Antwar that allowed me to focus on getting things to work adequately and focus on software design.

Earlier Antwar was designed based on a static directory structure. Primarily it relied on `pages`, `drafts` and `posts` directories and Markdown (with YAML headmatter) format. My book, however, uses another kind of structure, chapters are missing headmatter and ordering of chapters is defined by an external file.

This meant that Antwar had to change. And change it did.

## Antwar 0.5.0 - Expanded Configuration

Antwar, just like Webpack, is based on top of the idea of a project based configuration. We call that `antwar.config.js`. The idea is that you define how your content maps as a site there. To make Antwar work for my purposes I needed to generalize the configuration quite a bit. There are a couple of important additions related to asset handling, plugins, theming and paths.

> You can find the exact configuration in its entirety at [survivejs/webpack_react](https://github.com/survivejs/webpack_react) repository.

### Assets

Asset configuration allows you to copy arbitrary assets within your build. In my case I needed to copy `images` directory and `CNAME` file. Latter is used by GitHub to deal with domain mapping. If CNAME is set to point at your domain and you have configured your DNS to point at GitHub static hosting, your site will show up there.

```javascript
module.exports = {
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
  ...
};
```

### Plugins

We decided to standardize on plugin format. Now each plugin should return a function which takes possible options. In this case I'm setting up highlighting and previous/next links for all sections of the site. Later on we intend to allow more specific configuration per site section.

Plugins can inject new metadata and even markup to pages making this a powerful extension mechanism. Besides highlight and prevnext we have set up RSS plugin and there are plans for a few others including various commenting plugins.

```javascript
var highlightPlugin = require('antwar-highlight-plugin');
var prevnextPlugin = require('antwar-prevnext-plugin');

module.exports = {
  plugins: [
    highlightPlugin({
      style: function() {
        require('highlight.js/styles/github.css');
      },
      languages: ['bash', 'javascript', 'json', 'html'],
    }),
    prevnextPlugin({
      ...
    }),
  ],
  ...
};
```

### Theming

In this iteration we didn't spend much thought on theming. Themes gained some minor addition but I consider this portion of Antwar underdeveloped. We have a nice looking default theme thanks to Andreas but I feel there's room for improvement here. For completeness sake consider the example below:

```javascript
module.exports = {
  theme: {
    customStyles: 'custom.scss',
    name: 'antwar-default-theme',
    navigation: [
      {
        title: 'Home',
        url: '/'
      },
      {
        title: 'Table of Contents',
        url: '/webpack_react'
      },
    ],
  },
  ...
};
```

I think we'll push navigation to a plugin eventually. Now it just renders a navigation like that for each page. This is handy but not as good as it can be.

### Paths

The greatest innovation of Antwar 0.5.0 is the path configuration. Paths allow you to map content to your site. We let Webpack do the heavy lifting for us as you can see below. The system allows you to perform heavy transformations over data, sort it and so on.

```javascript
module.exports = {
  paths: {
    '/': {
      path: function() {
        return require.context('./pages');
      },
    },
    webpack_react: {
      title: 'Table of Contents',
      path: function() {
        return require.context('./manuscript', true, /^\.\/.*\.md$/);
      },
      processItem: {
        title: function(o) {
          return removeMd(o.file.__content.split('\n')[0]);
        },
        content: function(o) {
          var content = o.file.__content.split('\n').slice(1).join('\n');

          return mdWriter.render(mdReader.parse(content));
        },
        preview: function(o) {
          ...
        },
      },
      sort: function(files) {
        var order = require('raw!./manuscript/Book.txt').split('\n').filter(id);
        var ret = [];

        ...

        return ret;
      },
    }
  }
};
```

## Antwar 0.5.0 - Not Just for Blogs

Even though that's a lot of configuration you can see logic in it quite fast. It's just a series of mappings. In this case I define sections for `/` and `webpack_react`. Those `/` pages map to site root. `webpack_react` will receive a section of its own. Antwar will generate a section index and a page per entry file it finds for that.

The nice thing here is that we can leverage the power of Webpack to do all the heavy lifting. That's where all those `require.context` and `require` calls come from. It's true you'll have to understand Webpack a little bit to use our tool. On the plus side we take care of the configuration for you.

This design allowed us to drop the earlier static structure we depended upon. As a nice bonus we can now serve any content Webpack supports and aren't bound on Markdown anymore. You can of course author your pages through React components if you need something truly custom. The components will be compiled into HTML. One day we might want to allow something more dynamic.

We also moved from absolute links to relative ones. This means you can host Antwar below an arbitrary url structure without any problem. This is important in case you want host something below GitHub Pages (ie. not at root).

I think with a bit of effort you could host image galleries and such on top of Antwar but these are ideas I have yet to explore. Ideally you would just point a directory of images to it and everything would just work.

## Antwar - What Next?

Older features, such as interactive development mode (`antwar -d`) and easy GitHub deployment (`antwar -D`) still work of course and make Antwar pleasant to use. For me Antwar is starting to feel like a serious tool now. I can, for instance, add a blog to my book site with a bit of configuration. Particularly `paths` mappings feel powerful and allow me to develop on top of Antwar instead of in it.

There is still design and work left to do on theming and plugin department. Even though it is easy to develop plugins to extend a site even right now I feel we'll need to take the approach further. In particular we'll want to make sure you can customize site per section adequately.

In order to provide better sites for various libraries of mine, such as [reactabular](https://bebraw.github.io/reactabular/), I'll need to think carefully about integrating interactive React examples to the output. I believe with a bit of work Antwar could become a good basis for project sites.

I believe Antwar 0.5.0 is an important step towards a refreshingly different static site generator. It is starting to show some promise already. If you are willing to tolerate a certain lack of features and possible little glitches, maybe you should give it a go. In any case keep an eye on the project as here we come!
