import * as _ from 'lodash';

// 创建 字母数字组合
export function randomString(len?: number, charSet?: string) {
  len = len || 8; // 默认 8位
  charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // 默认 大写字母+数字 集合
  let randomString = "";
  for (let i = 0; i < len; i++) {
    let randomPos = Math.floor(Math.random() * charSet.length); // 默认 0-35 的整数
    randomString += charSet.substring(randomPos, randomPos + 1);
  }
  return randomString;
}

//搜索 filter
export function encodeObject(obj: Object) {
  function go(obj: any, res: string[], prefix: string) {
    let kv;
    if (obj == null || obj == '') {
      console.log(prefix)
      console.log(obj)
    } else if (_.isArray(obj)) {
      obj.map(function (item, i) {
        const path = prefix + "[" + i + "]";
        go(item, res, path)
      })
    } else if (typeof obj == "object") {
      _(obj).keys().map(function (key) {
        const value = obj[key];
        const path = prefix ? prefix + "." + key : key;
        go(value, res, path)
      }).value()
    } else {
      kv = prefix + "=" + obj;
      kv = kv.replace(/\+/g, "%2B"); // url编码时，会将+转义为空格
      res.push(kv)
    }
  }

  const res: string[] = [];
  const prefix = "";
  go(obj, res, prefix);
  return res.join("&");
}

export function decodeObject(str: string): any {
  let obj = {};
  _(str).split("&").map(function (kv) {
    let kvs = kv.split("=");
    if (!kvs[0] || !kvs[1]) {
      return;
    }
    _.set(obj, decodeURIComponent(kvs[0]), decodeURIComponent(kvs[1]))
  }).value();
  return obj;
}

export function searchObject(search: string = null): any {
  if (search == null) {
    search = location.search.substring(1)
  }
  return decodeObject(search)
}

//设置、获取cookie
export function setCookie(key, value) {
  document.cookie = key + "=" + value;
}

export function getCookie(key) {
  const name = key + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}