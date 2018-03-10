import merge from "webpack-merge";
import config from "_antwar-config";

import defaultAntwar from "./default-antwar";

module.exports = merge(defaultAntwar(), config(process.env.NODE_ENV));
