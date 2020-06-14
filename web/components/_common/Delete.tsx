import React from "react";
import {observer} from "mobx-react";
import {Button, Popconfirm} from "antd";

interface Props {
  title: string
  onConfirm: () => any
  disabled?: boolean
  btnText?: string
  btnSize?: any
  btnKey?: any
}

const CommonDelete = observer((props: Props) => {
  return <Popconfirm
    title={props.title}
    onConfirm={props.onConfirm}
    okText="Yes"
    cancelText="No"
  >
    <Button type={'danger'}
            key={props.btnKey || Math.random()}
            disabled={props.disabled}
            size={props.btnSize || 'small'}>
      {props.btnText || "删除"}
    </Button>
  </Popconfirm>
});

export default CommonDelete;