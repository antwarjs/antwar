module.exports = () => ({
  template: {
    title: "Smoke test",
  },
  output: "build",
  paths: {
    "/": () => require("./layouts/Standalone").default,
    "/pages": {
      content: () => require.context("./pages", true, /^\.\/.*\.md$/),
      layout: () => require("./layouts/Index").default,
      redirects: {
        "same-section": "in-same",
        "different-section": "/demo",
        "different-site": "https://google.com",
      },
    },
    standalone: () => require("./layouts/Standalone").default,
    demo: {
      content: () => require.context("./pages", true, /^\.\/.*\.md$/),
      layout: () => require("./layouts/Page").default,
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
    },
  },
});
