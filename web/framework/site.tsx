import React from "react";
import {LocaleProvider, Modal} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import * as mobx from "mobx"

export function action(fn) {
  return mobx.action(fn)
}

export function confirm(props: {
  title?: string,
  okText?: string,
  cancelText?: string,
  onOk?: (close: () => any) => any,
  onCancel?: (close: () => any) => any,
  content?: any,
}) {
  return Modal.confirm(props)
}

export function withKey<T>(obj: T): T {
  (obj as any)._key = Math.random().toString();
  return obj
}

export function getKey(obj): string {
  return obj.id || obj._key;
}

export function SiteLocaleProvider(props) {
  return <LocaleProvider locale={zh_CN} {...props}/>
}

export function SiteIf(props: { value: boolean, children? }) {
  if (props.value) {
    return props.children
  } else {
    return null;
  }
}

export function SiteIfElse(props: { value: boolean, if: any, else: any }) {
  if (props.value) {
    return props.if || null;
  } else {
    return props.else || null;
  }
}

const SwitchContext = React.createContext(null);

export function SiteSwitch(props: { value: any, children? }) {
  return <SwitchContext.Provider value={props.value}>
    {props.children}
  </SwitchContext.Provider>
}

export function SiteCase(props: { case: any, children? }) {
  let value = React.useContext(SwitchContext);
  if (props.case === value) {
    return props.children;
  } else {
    return null;
  }
}

export const JVOID = "javascript:void(0);";

export const $$ = () => {
  return (window as any).$
};