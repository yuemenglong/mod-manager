import "../style/_common/modal.less";
import * as _ from "lodash";

interface Props {
  visible: boolean,//是否显示Modal
  title?: string,//头部内容
  footer?: boolean,//是否显示默认底部
  children?: any//modal中的内容
  onCancel?: () => any//取消
  onOk?: () => any
}

const Modal = (props: Props) => {
  let {visible, title, footer} = props;
  let footerNow = footer == undefined ? true : footer;//footer默认为true

  let renderTitle = () => {
    if (!title) return null;
    return <div className={'container-modal-header'}>
      <div className={'title'}>{_.get(props, 'title', '')}</div>
    </div>
  };

  let renderFooter = () => {
    if (!footerNow) return null;
    return <div className={'container-modal-footer'}>
      <button onClick={props.onCancel} className={'btn-cancel'}>取消</button>
      <button onClick={props.onOk} className={'btn-ok'}>确定</button>
    </div>
  };

  return <div className={'container-modal'} style={{display: visible ? "block" : 'none'}}>
    <div className={'container-modal-wrap'}>
      <button onClick={props.onCancel} className={'btn-x'}>X</button>
      {renderTitle()}
      <div className={'container-modal-body'}>{props.children}</div>
      {renderFooter()}
    </div>
  </div>
};

export default Modal;