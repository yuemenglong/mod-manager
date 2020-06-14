import { observer } from "mobx-react";
import Uploader from "../commons/Uploader";
import { useArray, useBox } from "../framework/hooks";
import { Button, Upload } from "antd";
import { ajaxPost } from "../framework/ajax";
import { RcFile } from "antd/lib/upload";

const { Dragger } = Upload;

const DraggerView = ({ onChange }) => {
  return <Dragger showUploadList={false}
    beforeUpload={(f, ) => {
      onChange(f.name)
      return false
    }}>
    <p style={{ height: "200px" }}>拖拽到这里</p>
  </Dragger>
}

const Index = observer(() => {
  let dir = useBox(null)
  return <div>
    <h1>Index</h1>
    <DraggerView onChange={s => dir.set(s)}></DraggerView>
    <div>{dir.get()}</div>
    <Button disabled={dir.get() == null} onClick={() => {
      ajaxPost("/batch", { root: dir.get() }).then(res => {
        console.log(res)
      })
    }}>上传</Button>
  </div>
});

export default () => {
  return <Index></Index>
} 