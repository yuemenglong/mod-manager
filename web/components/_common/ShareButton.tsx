import {observer} from "mobx-react";
import { Typography } from 'antd';
import {ShareAltOutlined} from "@ant-design/icons/lib";
import React from "react";

const { Paragraph } = Typography;
let ShareButton = observer((props)=>{
  return <span className={'share-button'} style={props.style ||{}}>
    <ShareAltOutlined/>
    <div className={'share-img'}>
      <img src="/static/assets/img/share_info.png" alt=""/>
    </div>
  </span>
})
export default ShareButton;