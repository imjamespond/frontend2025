import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

import path from "path";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.join(__dirname, "./src/assets"),
      "@service": path.join(__dirname, "./src/service"),
      "@commons": path.join(__dirname, "./src/commons"),
      "@components": path.join(__dirname, "./src/components"),
      "@config": path.join(__dirname, "sr./srcc/config"),
      "@": path.join(__dirname, "./src"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  source: {
    define: {
      "process.env.devMode": JSON.stringify(process.env.NODE_ENV !== "production"),
    },
  },
  plugins: [pluginReact(), pluginSass()],
});
