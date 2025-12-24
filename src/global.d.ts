/**
 * CSS
 */
declare module '*.css' {}
declare module '*.scss' {}
declare module '*.sass' {}

interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
}

declare namespace NodeJS {
  interface ProcessEnv {
    devMode: boolean;
  }
}