import type { AxiosResponse } from "axios";

/**
 * 解析文件名
 * @param res
 * @param _filename
 */
export default function dl(res: AxiosResponse, _filename?: string) {
  const data = res.data; // responseType: 'blob'，
  const headers = res.headers;

  /**
   * // https://developer.mozilla.org/zh-CN/docs/web/http/headers/content-disposition
   * attachment; filename="filename.jpg"
   */
  let filename = _filename;
  const disposition = headers["content-disposition"];
  if (disposition && disposition.indexOf("attachment") !== -1) {
    const filenameRegex = /filename\*?=(?:UTF-8''|)["']?([^;"']+)["']?/i;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, "");
    }
  }

  if (filename) {
    filename = decodeURIComponent(filename);
    download(data, filename);
  }
}

export function download(data: Blob, filename: string) {
  const url =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(data)
      : window.webkitURL.createObjectURL(data);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", filename); //or any other extension
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href); // 释放URL 对象
  document.body.removeChild(link);
}
