import React, {useState, useEffect} from "react";
import {observer} from "mobx-react";
import {FileMeta} from "../../entity/entity";
import {getFilePath} from "../../framework/ajax";
import {Icon, Modal, Upload} from "antd";
import {SettingOutlined} from "@ant-design/icons/lib";

const style = `
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
`;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface Props {
  action: string
  accept?: string
  onChange: (file) => any
  handleDownload:(file) => any
  pics:FileMeta[]
  maxPic:number
}

const UploaderPics=observer((props:Props)=>{
  let initFileList = () => {
    return props.pics.map((pic: FileMeta) => {
      return {
        uid: pic.id,
        name: pic.name,
        status: "done",
        url: getFilePath(pic),
        response: [pic]
      }
    });
  };
  let [fileList, setFileList] = useState(initFileList);
  let [previewVisible, setPreviewVisible] = useState(false);
  let [previewImage, setPreviewImage] = useState("");
  useEffect(()=>{
    // setFileList(initFileList())
    if(props.pics.length){
      console.log('---')
    }
  },[]);


  let handleCancel = () => setPreviewVisible(false);

  let handlePreview = async file => {
    console.log('==file=',file,'==')
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  let handleChange = (info) => {
    let {file, fileList} = info;
    setFileList(fileList);
    if (file.status != "done") {
      return
    }
    let metas = fileList.map(file => {
      return file.response[0];
    });
    props.onChange(metas)
  };

  const uploadButton = (
    <div>
      <Icon type="plus"/>
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div className="clearfix">
      <Upload 
        name="avatar"
        action={props.action}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        accept={props.accept}
        onDownload={props.handleDownload}
        showUploadList={{showDownloadIcon: true}}
      >
        {fileList.length >= props.maxPic ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage}/>
      </Modal>
      <style>{style}</style>
    </div>
  );
});

export default UploaderPics;