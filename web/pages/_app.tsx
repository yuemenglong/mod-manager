// pages/_app.js
require("babel-polyfill");
import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'
import * as _ from "lodash"
import { $RouterContext } from '../framework/hooks';
import LayoutRouter from '../components/layout/LayoutRouter';

export default class MyApp extends App<any, any> {
  static getInitialProps({ Component, router, ctx }) {
    let ctxs = _.assign({}, { router }, ctx)
    return Promise.all([
      Component.getInitialProps ? Component.getInitialProps(ctxs) : Promise.resolve({}),
      LayoutRouter.getInitialProps ? LayoutRouter.getInitialProps(ctxs) : Promise.resolve({}),
    ]).then(([pageProps, layoutProps]) => {
      return { pageProps, layoutProps }
    }).catch(err => {
      // 系统错误不处理
      if (_.isError(err)) {
        throw err
      } else {
        // 只处理用户定义错误
        return { err }
      }
    })
  }

  render() {
    const { Component, pageProps, layoutProps, router, err } = (this as any).props;
    if (err) {
      return JSON.stringify(err)
    }
    return (
      <$RouterContext.Provider value={router}>
        <Container>
          <Head>
            <title>线下订单</title>
            <script src="/static/assets/js/patch.js" />
            <script src="/static/assets/js/polyfill.min.js" />
            <script src="/static/assets/js/es5-sham.min.js" />
            <script src="/static/assets/js/es5-shim.min.js" />
            <script src="/static/assets/js/es6-sham.min.js" />
            <script src="/static/assets/js/es6-shim.min.js" />
            <script src="/static/assets/js/es7-shim.min.js" />
            <script src="/static/assets/js/jquery-1.12.4.min.js" />
            <link href="/static/assets/css/antd.min.css" rel="stylesheet"></link>
          </Head>
          <LayoutRouter {...layoutProps}>
            <Component {...pageProps} />
          </LayoutRouter>
        </Container>
      </$RouterContext.Provider>
    )
  }
}