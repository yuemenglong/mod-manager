import React, { useState } from "react"
import { Upload, Button, Icon, message } from 'antd';
import { observer } from "mobx-react"
import { useBox } from "../../framework/hooks";
import { getFilePath } from "../../framework/ajax";
import { UploadOutlined } from '@ant-design/icons';
import { FileMeta } from "../../entity/entity";

interface Props {
  action: string
  onChange: (file) => any
  beforeUpload?: (file) => boolean
  accept?: string
  multiple?: boolean
  directory?: boolean
  isOne?: boolean
  pics?: FileMeta[]
  file?: FileMeta
}

const UploaderFile = observer((props: Props) => {
  // 状态有：uploading done error removed
  let initFileList = () => {
    if (props.multiple) {
      return props.pics.map((pic: FileMeta) => {
        return {
          uid: pic.id,
          name: pic.name,
          status: "done",
          url: getFilePath(pic),
          response: [pic]
        }
      });
    } else {
      let file = props.file
      console.log(file)
      if (!file || !file.path) {
        console.log(file)
        return []
      }
      return [{
        uid: file.id,
        name: file.name,
        status: "done",
        url: getFilePath(file),
        response: [file]
      }]
    }
  };

  let [fileList, setFileList] = useState(initFileList);

  let handleChange = info => {
    let { file, fileList } = info;
    if (props.multiple) {
      setFileList(fileList);
      if (file.status != "done") {
        return
      }
      let metas = fileList.map(file => {
        return file.response[0];
      });
      props.onChange(metas)
    } else {
      if(file.status == "removed") {//删除
        setFileList([])
        props.onChange({})
      } else if(file.status == "error") {//失败
        setFileList([file])
        props.onChange({})
      } else if(file.status == "uploading") {//上传中
        setFileList([file])
      } else {//上传
        setFileList([file])
        props.onChange(file.response[0])
      }
    }
  };

  return (
    <Upload
      listType='picture'
      action={props.action}
      fileList={fileList}
      onChange={handleChange}
      accept={props.accept}
      multiple={props.multiple}>
      <Button>
        <UploadOutlined /> Upload
      </Button>
    </Upload>
  );
});

export default UploaderFile;