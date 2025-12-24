import getConfig, { Env } from "./webpack.config";
import merge from "webpack-merge";
import path from "path";
import fs from "fs";

const dir = fs.realpathSync(process.cwd());

export default (env: Env, options: unknown) => {
  return merge(getConfig(env, options), {
    devServer: {
      port: 9000,
      historyApiFallback: true,
      hot: "only",
      client: {
        progress: true,
        // overlay: false, //禁止弹窗报错
      },
    },
    cache: {
      type: "filesystem",
      cacheDirectory: path.resolve(dir, ".cache"),
      buildDependencies: {
        config: [__filename], // webpack 配置文件变化会刷新 cache
      },
    },
  });
};
