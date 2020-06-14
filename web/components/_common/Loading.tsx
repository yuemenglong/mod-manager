import React from "react"
import {observer} from "mobx-react";
import "../style/loading.less"

interface Props {
  show: boolean;
}

export let Loading = observer((props: Props) => {
  let ret = props.show ? <div className={'top-loading'}/> : null;
  return ret;
})