const fetch = require('node-fetch');

module.exports = function (config) {
  const console = config.console;

  return fetch('http://npmsearch.com/query?q=antwar&fields=keywords,description,name')
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      json.results.forEach(function (el) {
        console.info('* ' + el.name + ' - ' + el.description);
      });
    })
    .catch(function (err) {
      console.warn('Something went wrong:', err);
    });
};
