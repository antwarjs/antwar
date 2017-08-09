const highlight = require("../utils/highlight");

// TODO: allow language to be defined through an option
module.exports = function(source) {
  const language = "javascript";

  return `<pre><code class="lang-${language}">${highlight(
    source,
    language
  )}</code></pre>`;
};
