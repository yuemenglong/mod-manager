import { observer } from "mobx-react";
import Uploader from "../commons/Uploader";
import { useArray, useBox, useMobx } from "../framework/hooks";
import { Button, Upload, Table, Input, Modal } from "antd";
import { ajaxPost, ajaxGet, ajaxDelete } from "../framework/ajax";
import { RcFile } from "antd/lib/upload";
import { Batch, BatchFile } from "../entity/entity";
import { useEffect } from "react";

const { Dragger } = Upload;

const Index = observer(() => {
  let list = useArray(new Array<Batch>())
  let [detail, detailSet] = useMobx<Batch>(null)
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
          <Button onClick={() => {
            detailSet(x)
          }}>详情</Button>
        </div>
      }
    },
  ]
  let modal = null
  if (detail != null) {
    modal = <Modal visible={true}
      onOk={() => { detailSet(null) }}
      onCancel={() => { detailSet(null) }}
    >
      <Table dataSource={detail.files.slice()}
        rowKey="id"
        columns={[
          { title: "路径", key: "path", render: (x: BatchFile) => x.path },
          { title: "操作", key: "act", render: (x: BatchFile) => x.act },
        ]}
      />
    </Modal>
  }
  return <div>
    <Dragger showUploadList={false}
      openFileDialogOnClick={false}
      beforeUpload={(f,) => {
        ajaxPost("/batch", { root: f.name }).then(res => {
          list.push(res.data)
        })
        return false
      }}>
      <Button onClick={() => { ajaxGet("/open?name=game") }}>打开Game</Button>
      <Button onClick={() => { ajaxGet("/open?name=mod") }}>打开Mod</Button>
      <Button onClick={() => { ajaxGet("/open?name=backup") }}>打开Backup</Button>
      <Button onClick={() => { ajaxGet("/open?name=trash") }}>打开Trash</Button>
      <Table dataSource={list.slice()}
        rowKey={"id"}
        columns={columns}
        pagination={{ pageSize: 1000 }}
      />
    </Dragger>
    {modal}
  </div>
});


export default () => {
  return <Index></Index>
} 