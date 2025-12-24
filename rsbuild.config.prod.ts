import { mergeRsbuildConfig } from "@rsbuild/core";
import config from "./rsbuild.config";

const packageName = "data-atlas";

export default mergeRsbuildConfig(config, {
  tools: {
    rspack: {
      output: {
        library: `${packageName}-[name]`,
        libraryTarget: "umd",
        chunkLoadingGlobal: `webpackJsonp_${packageName}`,
      },
    },
  },
  output: {
    polyfill: "usage",
  },
});
