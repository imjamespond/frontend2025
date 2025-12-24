import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginEslint } from "@rsbuild/plugin-eslint";


const devMode = process.env.NODE_ENV !== "production";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  output: { assetPrefix: "/data-atlas"},
  source: {
    define: {
      "process.env.devMode": JSON.stringify(devMode),
    },
  },
  plugins: [pluginReact(), pluginSass(), pluginEslint({ enable: devMode })],
});
