module.exports = {
  template: {
    title: "Smoke test",
  },
  render: {
    interactive({ component, props }) {
      // TODO: this should call
      // https://github.com/developit/preact-render-to-string
      // to make SSR work
      //
      // Problem: worker process needs to import the config file
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
};
