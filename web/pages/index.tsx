import { observer } from "mobx-react";
import Uploader from "../commons/Uploader";
import { useArray, useBox } from "../framework/hooks";
import { Button, Upload, Table, Input } from "antd";
import { ajaxPost, ajaxGet, ajaxDelete } from "../framework/ajax";
import { RcFile } from "antd/lib/upload";
import { Batch } from "../entity/entity";
import { useEffect } from "react";

const { Dragger } = Upload;

const DraggerView = ({ onChange }) => {
  return <Dragger showUploadList={false}
    beforeUpload={(f, ) => {
      onChange(f.name)
      return false
    }}>
    <p style={{ height: "200px", fontSize: "30pt" }}>拖拽到这里</p>
  </Dragger>
}

const Index = observer(() => {
  let uploadDir = useBox(null)
  let list = useArray(new Array<Batch>())
  useEffect(() => {
    ajaxGet("/batch/list").then(res => {
      list.replace(res.data)
    })
  }, [])
  let columns = [
    { title: "id", key: "id", render: (x: Batch) => x.id },
    { title: "名称", key: "name", render: (x: Batch) => x.name },
    { title: "时间", key: "time", render: (x: Batch) => x.timestamp },
    {
      title: "操作", key: "op", render: (x: Batch) => {
        return <div>
          <Button type="danger" onClick={() => {
            if (confirm("确认删除")) {
              ajaxDelete("/batch?id=" + x.id).then(res => {
                list.remove(x)
              })
            }
          }}>删除</Button>
        </div>
      }
    },
  ]
  return <div>
    <DraggerView onChange={s => uploadDir.set(s)}></DraggerView>
    <Input value={uploadDir.get()}></Input>
    <Button type={"primary"} onClick={() => {
      if (uploadDir.get() != null) {
        ajaxPost("/batch", { root: uploadDir.get() }).then(res => {
          list.push(res.data)
          uploadDir.set(null)
        })
      }
    }}>上传</Button>
    <Button onClick={() => { ajaxGet("/open?name=backup") }}>打开backup</Button>
    <Button onClick={() => { ajaxGet("/open?name=trash") }}>打开trash</Button>
    <Table dataSource={list.slice()}
      rowKey={"id"}
      columns={columns}
    />
  </div>
});

export default () => {
  return <Index></Index>
} 