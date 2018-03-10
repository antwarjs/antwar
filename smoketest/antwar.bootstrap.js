const antwar = require("antwar");

const environment = process.argv[2];

antwar[environment]({
  environment,
  configurationPaths: {
    antwar: require.resolve("./antwar.config"),
    webpack: require.resolve("./webpack.config"),
  },
})
  .then(() => {
    if (environment !== "build") {
      console.log("Surf to localhost:3000");
    }
  })
  .catch(err => {
    console.error(err);

    process.exit(1);
  });
