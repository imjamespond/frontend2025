declare module "*.css" {}
declare module "*.scss" {}
declare module "*.sass" {}
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
}

declare namespace NodeJS {
  interface ProcessEnv {
    devMode: boolean;
  }
}
