// webpack.config.ts

import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { DefinePlugin } from "webpack";

import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

import { name } from "./package.json";

const isProduction = process.env.NODE_ENV === "production";
const devMode = !isProduction;

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : "style-loader";

export type Env = {
  PublicPath?: string;
  Demo?: boolean;
  CompatibleMode?: boolean; // 旧浏览器兼容
};

export type Opt = {
  mode: string;
  nodeEnv: string;
  config: [string];
  env: { WEBPACK_BUNDLE: boolean; WEBPACK_BUILD: boolean };
};

export default (env: Env, options: unknown) => {
  console.log({ isProduction, env, options });

  const publicPath = env["PublicPath"] || "/" + name + "/";
  const config: Configuration & DevServerConfiguration = {
    mode: isProduction ? "production" : "development",
    entry: { index: "./src/index.tsx" },
    output: {
      publicPath, // browser 访问路径
      path: path.join(__dirname, "dist", publicPath), // 输出路径
      filename: "[name].[chunkhash:5].js",
      chunkFilename: "chunk[id].[chunkhash:5].js",
      // qiankun 参数
      library: `${name}-[name]`,
      libraryTarget: "umd",
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html",
        chunks: ["index"],
        devMode,
        title: name,
      }),
      new DefinePlugin({
        "process.env.devMode": JSON.stringify(devMode),
        "process.env.publicPath": JSON.stringify(publicPath),
        "process.env.demo": JSON.stringify(!!env.Demo),
        "process.env.compatibleMode": JSON.stringify(!!env.CompatibleMode),
      }),
    ],
    module: {
      rules: [
        // antv/x6 v3
        // 针对 node_modules 的 js，禁用 fullySpecified
        // Webpack 默认会把 node_modules 下的 .js 当作 ESM，如果路径不带扩展名就报错
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        // 参考
        // https://github.com/swc-project/pkgs/blob/main/packages/swc-loader/example/webpack.config.js
        true
          ? {
              test: /\.[jt]sx?$/,
              use: {
                loader: "swc-loader",
                options: {
                  jsc: {
                    parser: {
                      syntax: "typescript",
                      tsx: true,
                      dynamicImport: true,
                      // decorators: true,
                    },
                    transform: {
                      react: {
                        runtime: "automatic",
                        refresh: devMode,
                      },
                    },
                  },
                },
              },
              include: /src/,
            }
          : {
              test: /\.(ts|tsx)$/i,
              loader: "ts-loader",
              exclude: [/node_modules/],
            },
        {
          test: /\.s[ac]ss$/i,
          use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
        },
        {
          test: /\.css$/i,
          use: [stylesHandler, "css-loader", "postcss-loader"],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset",
        },
        // conflict with HtmlWebpackPlugin
        // {
        //   test: /\.html$/i,
        //   use: ["html-loader"],
        // },
      ],
    },
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@service": path.resolve(__dirname, "src/service"),
        "@common": path.resolve(__dirname, "src/common"),
        "@components": path.resolve(__dirname, "src/components"),
        "@config": path.resolve(__dirname, "src/config"),
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    },
    optimization: {
      splitChunks: {
        chunks: "all", // 对所有模块进行优化，包括同步和异步模块
        cacheGroups: {
          // 提取 react 和 react-dom 到一个单独的 chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "vendor-react",
            priority: 20, // 权重高，优先提取
          },
          // 提取 antd 到一个单独的 chunk
          antd: {
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            name: "vendor-antd",
            priority: 15,
          },
          ant: {
            test: /[\\/]node_modules[\\/]@ant-design/,
            name: "vendor-ant-design",
            priority: 15,
          },
          antv: {
            test: /[\\/]node_modules[\\/]@antv/,
            name: "vendor-antv",
            enforce: true,
            priority: 10,
          },
          rc: {
            test: /[\\/]node_modules[\\/]@?rc/,
            name: "vendor-rc",
            enforce: true,
            priority: 10,
          },
          tanstack: {
            test: /[\\/]node_modules[\\/]@tanstack/,
            name: "vendor-tanstack",
            enforce: true,
            priority: 10,
          },
          // 提取其他 node_modules 中的公共库
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10, // 权重较低，确保 react 和 antd 优先被提取
            enforce: true,
          },
          // 默认组（应用代码中的公共模块）
          default: {
            minChunks: 2, // 至少被两个入口引入才提取
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };

  // 在生产模式下添加 MiniCssExtractPlugin
  if (isProduction) {
    config.plugins?.push(new MiniCssExtractPlugin());
  } else {
    config.plugins?.push(new ReactRefreshWebpackPlugin());
  }
  if ("Analyzer" in env) {
    config.plugins?.push(new BundleAnalyzerPlugin());
  }
  return config;
};
