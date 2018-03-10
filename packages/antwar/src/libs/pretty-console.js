const simpleTimestamp = require("simple-timestamp");
const chalk = require("chalk");

module.exports = {
  log(...args) {
    console.log(simpleTimestamp(), chalk.green.apply(null, args));
  },
  info(...args) {
    console.info(simpleTimestamp(), chalk.blue.apply(null, args));
  },
  error(...args) {
    console.error(simpleTimestamp(), chalk.bold.red.apply(null, args));
  },
  warn(...args) {
    console.warn(simpleTimestamp(), chalk.yellow.apply(null, args));
  },
};
