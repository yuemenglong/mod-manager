const _ = require("lodash")

const express = require('express');
const next = require('next');
const http = require("http");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 一定要放在后面
const getConfig = require("./site.config").getConfig;
const rewriteUrl = require("./site.config").rewriteUrl;

process.on('uncaughtException', function (err) {
  // handle the error safely
  console.error(err.stack)
});

let config = getConfig()
console.log("Config", config)

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("/only-for-test", (req, res) => {
      return res.json({ username: "zhangsan", password: "123456" });
    });

    server.get('*', (req, res) => {
      if (req.xhr) {
        return pipe(req, res);
      } else {
        preHandle(req, res)
        return handle(req, res);
      }
    });

    server.post('*', pipe);
    server.delete('*', pipe);

    server.listen(config.port, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:' + config.port);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });


function pipe(proxyReq, proxyRes) {
  let [host, port] = config.backendUrl.split(":");
  let options = {
    host: host,
    port: port,
    path: proxyReq.url,
    method: proxyReq.method,
    headers: proxyReq.headers,
  };
  let backendReq = http.request(options, function (backendRes) {
    proxyRes.writeHead(backendRes.statusCode, backendRes.headers)
    backendRes.pipe(proxyRes);
    console.log(`Pipe ${options.method} ${options.path}`)
  });
  backendReq.on("error", err => {
    console.error(err.stack);
    proxyRes.status(500).json({
      name: "BACKEND_ERROR",
      message: err.toString(),
    })
  });
  proxyReq.pipe(backendReq)
}

function preHandle(req, res) {
  // let url = req.url
  // req.url = rewriteUrl(req.url)
  console.log(`Handle ${req.url}`)
}
