import { mergeRsbuildConfig } from "@rsbuild/core";
import config from "./rsbuild.config";

const proxy = "http://192.168.0.179:8089/";

export default mergeRsbuildConfig(config, {
  html: {
    template: "./public/dev.html",
  },

  dev: {
    progressBar: true,
  },

  server: {
    proxy: {
      "/api": {
        target: proxy,
      },
    },
  },
});
