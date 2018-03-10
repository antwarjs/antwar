const render = require("preact-render-to-string");
const { h } = require("preact");

module.exports = () => ({
  template: {
    title: "Smoke test",
  },
  render: {
    interactive({ component, props }) {
      return render(h(component, props));
    },
  },
  output: "build",
  paths: {
    "/": () => require("./layouts/Standalone").default,
    "/pages": {
      content: () => require.context("./pages", true, /^\.\/.*\.md$/),
      layout: () => require("./layouts/Index").default,
    },
    standalone: () => require("./layouts/Standalone").default,
    demo: {
      content: () => require.context("./pages", true, /^\.\/.*\.md$/),
      layout: () => require("./layouts/Page").default,
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
    },
  },
});
