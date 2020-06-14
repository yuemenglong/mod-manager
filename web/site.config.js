const _ = require("lodash")
const getConfig = require('next/config').default
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

const backendProto = "http://";
const backendUrl = "localhost:8080";
const port = 3000;
const site = "pc";
const googleMapKey = "AIzaSyBWfDd0Wrwl44JNYxeUILT0AmsuCXpxULo";

let defaultConfig = {
  site,
  backendProto,
  backendUrl,
  port,
  googleMapKey
}

let siteConfig = _.merge({}, defaultConfig, publicRuntimeConfig)

// export default siteConfig;
module.exports = {
  getConfig: () => {
    return siteConfig
  },
  rewriteUrl: (url) => {
    let ret = url
    let ignores = ["_next", "admin", "static", "test"]
    let ss = url.split("/").filter(s => s.length > 0)
    if (ss.length == 0) {
      ret = "/" + siteConfig.site
    } else if (ss.length == 1 && ss[0].startsWith("?")) {
      ret = "/" + siteConfig.site + ss[0]
    } else if (ignores.indexOf(ss[0]) < 0) {
      ret = "/" + siteConfig.site + "/" + _.join(ss, "/")
    }
    return ret;
  }
};
