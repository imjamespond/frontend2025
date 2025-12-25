import { mergeRsbuildConfig } from "@rsbuild/core";
import config from "./rsbuild.config";

// const proxy = "http://192.168.0.179:8089/";
const proxy = "http://192.168.0.36:8080/";


export default mergeRsbuildConfig(config, {
  html: {
    template: "./dev/index.html",
  },

  dev: {
    progressBar: true,
  },

  server: {
    port: 9000,
    base: "/data-atlas",
    publicDir: [
      {
        name: "dev",
      },
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/api": {
        target: proxy,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  output: {
    polyfill: "off",
  },
});
