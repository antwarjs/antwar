[![build status](https://secure.travis-ci.org/antwarjs/prevnext-plugin.png)](http://travis-ci.org/antwarjs/prevnext-plugin)
# Google Analytics for Antwar

Usage:

```javascript
var prevnextPlugin = require('antwar-prevnext-plugin');

// generate just metadata
plugins: [
  prevnextPlugin()
]

// factory with custom previous/next (optional)
plugins: [
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
]
```

```css
.previous-page {
    left: 10px;
}

.next-page {
    right: 10px;
}

.previous-page::after {
    content: "\2190 Previous Chapter";
}

.next-page::after {
    content: "Next Chapter \2192";
}
```

## License

antwar-prevnext-plugin is available under MIT. See LICENSE for more details.

