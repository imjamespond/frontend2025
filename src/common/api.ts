import qs from "qs";
import type QueryString from "qs";
import axios from "axios";
import { type AxiosRequestConfig, type Method } from "axios";
import download from "./download";

export const ContentTypes = {
  JSON: "application/json",
  Data: "multipart/form-data",
  Form: "application/x-www-form-urlencoded",
};

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": ContentTypes.JSON,
  },
};

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error.response.data || "未知错误");
  }
);

export interface OptionsType<
  Params = unknown,
  Body = unknown,
  ParamsOfPath extends Record<string, string> | void = Record<string, string> | void
> extends AxiosRequestConfig {
  params?: Params; // override any
  body?: Body;
  paramsOfPath?: ParamsOfPath;
  arrayFormat?: QueryString.IStringifyBaseOptions["arrayFormat"];
  download?: boolean;
}

export const request = <T = unknown>(method: Method, url: string, options: OptionsType = {}) => {
  const { body: data, paramsOfPath, arrayFormat, ...rest } = options;
  let _url = url;
  if (paramsOfPath) {
    for (const [key, value] of Object.entries(paramsOfPath)) {
      _url = _url.replace(`{${key}}`, value);
    }
  }
  const resp = axios.request<T>({
    method,
    url: _url,
    data,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: arrayFormat || "repeat" }),
    ...config,
    ...rest,
  });
  return resp;
};

type Params<T> = Parameters<typeof request<T>>;

export default async function api<T = unknown>(...params: Params<T>) {
  const [method, url, options] = params;
  if (options?.download) {
    const resp = await request<T>(method, url, { ...options, responseType: "blob" });
    download(resp);
    return resp.data;
  } else {
    const resp = await request<T>(method, url, options);
    return resp.data;
  }
}
