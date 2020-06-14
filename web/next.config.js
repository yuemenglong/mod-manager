const withTypescript = require("@zeit/next-typescript");
const withLess = require("@zeit/next-less");
const _ = require("lodash")

// if (typeof require !== 'undefined') {
//   require.extensions['.less'] = (file) => {
//   }
// }
let manualConfig = _.fromPairs(process.argv.map(s => {
  return s.split("=")
}).filter(kv => kv.length == 2))

/* Without CSS Modules, with PostCSS */
module.exports = withTypescript(withLess({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]",
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: {
      // 'primary-color': '#1DA57A',
    }
  },
  publicRuntimeConfig: manualConfig
}));