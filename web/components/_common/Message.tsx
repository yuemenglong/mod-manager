import React from "react";
import '../style/_common/message.less';
import ReactDOM from "react-dom"

const Message = function (msg) {
  let id = "container-message";
  let node = document.createElement("div");
  node.setAttribute('id', id);
  document.getElementById("__next").appendChild(node);

  let onCancel = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById(id));
    document.getElementById("__next").removeChild(document.getElementById(id));
  };
  setTimeout(onCancel, 2000);


  const message = (<div className={'container-message-info'}>{msg}</div>);
  ReactDOM.render(message, document.getElementById(id));
};

export default Message;