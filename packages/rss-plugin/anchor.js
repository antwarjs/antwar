var _url = require('url');
var absolutify = require('absolutify');

var content = '<a href="#demo">demo</a></p>';

console.log(resolveUrls(content));

function resolveUrls (content) {
  return absolutify(content, function (url, attrName) {
    console.log('url', url);

    return url;
  });
}