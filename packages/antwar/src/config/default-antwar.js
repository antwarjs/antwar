const ReactDOMServer = require("react-dom/server");
const React = require("react");
const { Route, StaticRouter } = require("react-router");

const prettyConsole = require("../libs/pretty-console");

module.exports = function defaultConfiguration() {
  return {
    port: 3000,
    output: "build",
    console: prettyConsole,
    render: {
      page: renderPageDefault,
      interactive: renderInteractiveDefault,
    },
  };
};

function renderPageDefault({ location, content }, cb) {
  cb(null, {
    html: ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        StaticRouter,
        { location, context: {} },
        React.createElement(Route, { component: content })
      )
    ),
  });
}

function renderInteractiveDefault({ component, props }) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(component, props)
  );
}
