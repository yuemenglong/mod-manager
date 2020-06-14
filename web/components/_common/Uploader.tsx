import React, { useState } from "react"
import { Upload, Icon, message } from 'antd';
import { observer } from "mobx-react"
import { useBox } from "../../framework/hooks";
import { getFilePath } from "../../framework/ajax";

interface Props {
  action: string
  onChange: (file) => any
  file: any
  beforeUpload?: (file) => boolean
  accept?: string
  multiple?: boolean
  directory?: boolean
  isOne?: boolean
}

const Uploader = observer((props: Props) => {
  let loading = useBox(false);
  let [imageUrl, setImageUrl] = useState();

  let handleChange = info => {
    if (info.file.status === 'uploading') {
      loading.set(true);
      return;
    }
    // if (info.file.status === 'done') {
    //   props.onChange(info.file.response[0]);
    //   loading.set(false);
    // }
    if (!props.isOne && info.file.status === 'done') {
      props.onChange(info.file.response[0]);
      loading.set(false);
    }
    if (props.isOne && info.file.status === 'done') {
      let file = info.file.response[0];
      props.onChange(file);
      setImageUrl(getFilePath(file) as any)
      loading.set(false);
    }
  };

  const uploadButton = (
    <div>
      <Icon type={loading.get() ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const isOnePic = () => {
    if (props.isOne && props.file) {
      let imgUrl = getFilePath(props.file);
      if(props.file.ext && props.file.ext =='mp4') {
        return <video src={imgUrl as any} style={{ width: '100%' }} />
      } else {
        return <img src={imgUrl as any} alt="avatar" style={{ width: '100%' }} />
      }
    } else {
      return uploadButton;
    }
  };
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
      {/*{uploadButton}*/}
      {isOnePic()}
    </Upload>
  );
});

export default Uploader;