import React, { createContext, useContext } from "react"
import { observable, IObservableValue, IObservableArray, isObservable, intercept } from "mobx";
import * as _ from "lodash"

function attachIntercept(obj) {
  if (obj == null || !_.isObject(obj) || !(obj as any).$mobx) {
    return;
  }
  intercept(obj, interceptFn)
  for (let field in obj) {
    attachIntercept(obj[field])
  }
}

function interceptFn(change) {
  if (change.newValue) {
    change.newValue = toOb(change.newValue)
  }
  if (change.added) {
    change.added = change.added.map(toOb)
  }
  return change
}

function toPlainObject(value) {
  if (value == null) {
    return value;
  }
  if (_.isArray(value)) {
    return value.map(toPlainObject)
  } else if (_.isPlainObject(value)) {
    for (let field in value) {
      value[field] = toPlainObject(value[field])
    }
    return value
  } else if (_.isObject(value)) {
    value = _.toPlainObject(value)
    for (let field in value) {
      value[field] = toPlainObject(value[field])
    }
    return value
  } else {
    return value
  }
}

export function toOb<T>(value: T): T {
  if (value == null || isObservable(value)) {
    return value
  }
  let plain = toPlainObject(value)
  if (!_.isObject(plain)) {
    return plain
  }
  let ret = observable(plain)
  attachIntercept(ret)
  return ret as any;
}

export function useStore<T>(store: T): T {
  let [get,] = React.useState<T>(() => {
    return toOb(store)
  });
  return get
}

export function useArray<T>(array: Array<T>): IObservableArray<T> {
  let [get,] = React.useState(() => {
    return toOb(array) as any
  });
  return get
}

export function useObject<T>(obj: T): T {
  let [get,] = React.useState<T>(() => {
    return toOb(obj)
  });
  return get
}

export function useBox<T>(store: T): IObservableValue<T> {
  let [get,] = React.useState<IObservableValue<T>>(() => {
    return observable.box(toOb(store))
  })
  return get;
}

export function useMobx<T>(store: T): [T, (T) => any] {
  let [box,] = React.useState<IObservableValue<T>>(() => {
    return observable.box(toOb(store))
  });
  let set = (value: T) => {
    box.set(toOb(value))
  }
  return [box.get(), set];
}

export function watchMobx(obj) {
  for (let i in obj) {
    obj[i]
  }
}

export function watchMobxDeep(obj: any, ignoreFields: Array<String> = [], level: number = 8) {
  if (level < 0) {
    return
  }
  if (_.isArrayLike(obj) && !_.isString(obj)) {
    obj.slice().forEach(o => watchMobxDeep(o, ignoreFields, level - 1))
  } else if (_.isObject(obj)) {
    for (let i in obj) {
      if (_.findIndex(ignoreFields, x => x === i) >= 0) {
        continue;
      }
      watchMobxDeep(obj[i], ignoreFields, level - 1)
    }
  } else {
    return
  }
}

export const $RouterContext = createContext({})

export function useRouter(): any {
  return useContext($RouterContext)
}