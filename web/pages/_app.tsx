// pages/_app.js
require("babel-polyfill");
import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'
import * as _ from "lodash"
import { $RouterContext } from '../framework/hooks';

export default class MyApp extends App<any, any> {

  render() {
    const { Component, pageProps, router, err } = (this as any).props;
    if (err) {
      return JSON.stringify(err)
    }
    return (
      <$RouterContext.Provider value={router}>
        <Container>
          <Head>
            <title>ModManager</title>
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
          <Component {...pageProps} />
        </Container>
      </$RouterContext.Provider>
    )
  }
}