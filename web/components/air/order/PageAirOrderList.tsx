import { useArray } from "../../../framework/hooks"
import { useEffect } from "react"
import { AirOrder } from "../../../entity/entity"
import { ajaxGet } from "../../../framework/ajax"
import { Table } from "antd"
import { observer } from "mobx-react"

const PageAirOrderList = observer(() => {
  let list = useArray(Array<AirOrder>())
  useEffect(() => {
    ajaxGet("/air/order/list").then(res => {
      list.replace(res.data)
    })
  }, [])
  let columns = [
    {
      title: "编号", key: "id", render: (x: AirOrder) => {
        return <a href={"/air/order?id=" + x.id}>{x.id}</a>
      }
    }
  ]
  return <div>
    <h1>AirOrderList</h1>
    <Table dataSource={list.slice()}
      columns={columns}
      rowKey={"id"}
    ></Table>
  </div>
})

export default PageAirOrderList