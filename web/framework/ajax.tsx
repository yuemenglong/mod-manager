import axios from "axios"
import url from "url"
import { hideLoading, showLoading } from "./loading";
import { FileMeta } from "../entity/entity";
import * as _ from "lodash"
import { message } from "antd";
import { getConfig } from "../site.config";

let config = getConfig()

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;


export function isClient(): boolean {
  return !!(global as any).window
}

function handleError(err) {
  let res = err.response;
  if (!res) {
    throw err
  }
  if (isClient()) {
    let data = res.data || { name: "UNKNOWN_ERROR", message: err.toString() };
    let info = `${data.name || data.status}: ${data.message}`;
    if (res.status == 403) {
      // Router.push("/admin/login");
      message.info("没有权限，请重新登录");
      location.href = '/admin/login'
    } else {
      alert(info);
    }
  } else {
    console.error(err)
  }
  throw err
}

export function ajaxGet(url): Promise<any> {
  showLoading();
  return axios.get(url).catch(err => {
    handleError(err)
  }).finally(() => {
    hideLoading();
  })
}

export function ajaxPost(url, data): Promise<any> {
  showLoading();
  return axios.post(url, data).catch(err => {
    handleError(err)
  }).finally(() => {
    hideLoading();
  })
}

export function ajaxDelete(url): Promise<any> {
  showLoading();
  return axios.delete(url).catch(err => {
    handleError(err)
  }).finally(() => {
    hideLoading();
  })
}

// 3种状态
let shareResources = {};

export function ajaxShareGet(url): Promise<any> {
  if (!shareResources[url]) {
    shareResources[url] = {
      resources: undefined,
      waiting: []
    };
    // 第一个负责请求
    ajaxGet(url).then(res => {
      shareResources[url].resources = res;
      shareResources[url].waiting.forEach(fn => {
        fn(res);
      });
      shareResources[url].waiting = [];
    })
  }
  if (shareResources[url].resources !== undefined) {
    return new Promise((resolve, reject) => {
      return resolve(shareResources[url].resources)
    })
  }
  return new Promise((resolve, reject) => {
    shareResources[url].waiting.push((res) => {
      resolve(res)
    })
  })
}

export function getBackendUrl(path) {
  return url.resolve(config.backendProto + config.backendUrl, path);
}

export function getFilePath(file: FileMeta): string {
  if (!file || !file.path) return null
  let fix = (s: string) => {
    if (s.startsWith("/")) {
      return s
    } else {
      return "/" + s
    }
  }
  return (config.backendFileUrl || "") + fix("/static") + fix(file.root) + fix(file.path)
}

export function fetchData(namePathMap, ctx) {
  if (!ctx) {
    throw new Error("No Context When Call FetchData")
  }
  let config = {} as any
  let getPath = (path) => path
  if (ctx && ctx.req) {
    config.headers = ctx.req.headers
    getPath = (path) => getBackendUrl(path)
  }
  let reqs = _.values(namePathMap).map(path => {
    return axios.get(getPath(path), config).then(res => {
      console.log("Fetch " + path)
      return res.data
    }).catch(err => {
      console.log("Fetch Fail " + path + " " + err.response.data)
      throw [path, err] // 带上路径一起返回
    })
  })
  return Promise.all(reqs).then(res => {
    let result = _.zipObject(_.keys(namePathMap), res)
    return result
  }).catch(([path, err]) => {
    if (_.isString(err.response.data)) {
      err = _.merge({ path }, { message: err.response.data })
    } else {
      err = _.merge({ path }, err.response.data)
    }
    throw err
  })
}