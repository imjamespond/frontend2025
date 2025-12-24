import getConfig, { Env } from "./webpack.config";
import merge from "webpack-merge";
import { ProgressPlugin } from "webpack";

export default (env: Env, options: unknown) => {
  return merge(getConfig(env, options), {
    devtool: "cheap-module-source-map",
    output: {
      clean: true,
    },
    target: ["web", "es5"],
    optimization: {
      realContentHash: false, // Disable RealContentHashPlugin due to 105.248404 -> 105.42f664 Issue
      minimize: false,
    },

    plugins: [
      new ProgressPlugin((percentage, message, ...args) => {
        console.info((percentage * 100).toFixed(2), message, ...args);
      }),
    ],
  });
};
