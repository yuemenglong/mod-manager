import React from "react"
import { Upload, Icon } from 'antd';
import { observer } from "mobx-react"
import { useBox } from "../framework/hooks";
import { RcFile, UploadChangeParam } from "antd/lib/upload";

interface Props {
  action: string | ((file: RcFile) => string) | ((file: RcFile) => PromiseLike<string>);
  onChange: (file: RcFile) => any
  beforeUpload?: (file: RcFile, FileList: RcFile[]) => boolean | PromiseLike<void>
  accept?: string
  multiple?: boolean
  directory?: boolean
  children?: any
}

const Uploader = observer((props: Props) => {
  let loading = useBox(false);

  let handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      loading.set(true);
      return;
    }
    if (info.file.status === 'done') {
      if (props.multiple) {
        props.onChange(info.file.response);
      } else {
        props.onChange(info.file.response[0]);
      }
      loading.set(false);
    }
  };

  const uploadButton = (
    <div>
      <Icon type={loading.get() ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  let children = () => {
    if (props.children) {
      return props.children
    } else {
      return uploadButton
    }
  }

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={props.action}
      beforeUpload={props.beforeUpload}
      onChange={handleChange}
      accept={props.accept}
      multiple={props.multiple}
      directory={props.directory}
    >
      {children()}
    </Upload>
  );
});

export default Uploader;