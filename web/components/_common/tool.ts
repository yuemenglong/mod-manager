/*
* getParamsByQuery({ id:'', pid:'' , uid:''}) =>  id=&pid=&uid=
* getParamsByQuery({ id:'', pid:'' , uid:''} , [id])  =>  pid=&uid=
* */
import * as _ from "lodash";
import {observable} from "mobx";
export const getParamsByQuery  = (query:any = {},remove:Array<string> = [])=>{
  return _.zip(Object.keys(query),Object.values(query)).map((item,idx)=>{
    if (remove.includes(item[0])) {
      return undefined;
    }
    return !!item[1] ? item.join('=') : undefined;
  }).filter(item => item !== undefined).join('&');
}

export const getReq = (ctx) => {
  return ctx.req || ctx
}
export const useOtherData = (props, path) =>{
  if (_.get(props.children.props, path)) {
    return props.children.props[path];
  }
}

export const getOtherData = (data) => {
  return {
    ...data, other: {}
  }
};

export const setOtherData = (props, data) => {
  if (props.children.props['other']) {
    props.children.props['other'].data = {...data};
  }
};

export const timeToSec = (time) => {
  if (!!time) {
    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    var sec = time.split(':')[2];
    return Number(hour * 3600) + Number(min * 60) + Number(sec)
  } else {
    return 0
  }
};

export const isNotNull = (value) => {
  return !!value && value.trim.length > 0
}