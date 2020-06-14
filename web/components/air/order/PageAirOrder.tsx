import { Input, Button, Form, Modal, Table } from "antd"
import { useMobx, useArray, useRouter } from "../../../framework/hooks"
import { Custom, AirOrder } from "../../../entity/entity"
import _ from "lodash"
import { withValidator, ValidatorType, FormType, ValidatorProps, useValidator } from "../../../framework/validate"
import { ajaxPost, ajaxGet } from "../../../framework/ajax"
import { observer } from "mobx-react"
import { useEffect } from "react"

const PageAirOrder = observer(() => {
  let [order, orderSet] = useMobx(new AirOrder())
  let router = useRouter()
  useEffect(() => {
    if (router.query.id) {
      ajaxGet("/air/order?id=" + router.query.id).then(res => {
        orderSet(res.data)
      })
    }
  }, [])
  return <div>
    <h1>PageAirOrder</h1>
    <CustomInfo custom={order.custom}></CustomInfo>
  </div>
})

const createOrder = (custom: Custom) => {
  ajaxPost("/air/order", { customId: custom.id }).then(res => {
    location.href = "/air/order?id=" + res.data.id
  })
}

const CustomSelect = observer(({ custom, customs }) => {
  let columns = [
    { title: "电话1", key: "phone1", render: (x: Custom) => x.phone1 },
    { title: "电话2", key: "phone2", render: (x: Custom) => x.phone2 },
    { title: "姓", key: "lastName", render: (x: Custom) => x.lastName },
    { title: "中间名", key: "middleName", render: (x: Custom) => x.middleName },
    { title: "名", key: "firstName", render: (x: Custom) => x.firstName },
    {
      title: "选择", key: "select", render: (x: Custom) => <div>
        <Button onClick={() => {
          let send = _.merge({}, x)
          for (let field in send) {
            if (custom[field]) {
              send[field] = custom[field]
            }
          }
          send.id = undefined
          send.crTime = undefined
          send.upTime = undefined
          send.parentId = x.id
          ajaxPost("/custom/create", send).then(res => {
            createOrder(res.data)
          })
        }}>选择</Button>
      </div>
    },
  ]
  return <Modal visible={customs.length > 0}
    okText={"新建客户"}
    onOk={() => {
      ajaxPost("/custom/create?force=true", custom).then(res => {
        createOrder(res.data)
      })
    }}
  >
    <h1>Modal</h1>
    <Table dataSource={customs}
      columns={columns}
      rowKey={(x: Custom) => x.id as any}
    ></Table>
  </Modal>
})

const CustomInfo = withValidator(observer(({ custom }) => {
  console.log(custom)
  let { V, form } = useValidator()
  let customs = useArray(Array<Custom>())
  return <div>
    <span>电话1</span>
    <V name="phone1" initialValue={custom.phone1}
      rules={[{ required: true, pattern: /^\d{11}$/, message: "电话号码11位必填" }]}>
      <Input onChange={e => custom.phone1 = e.target.value}></Input>
    </V>
    <span>电话2</span>
    <Input value={custom.phone2} onChange={e => custom.phone2 = e.target.value}></Input>
    <span>姓</span>
    <Input value={custom.lastName} onChange={e => custom.lastName = e.target.value}></Input>
    <span>中间名</span>
    <Input value={custom.middleName} onChange={e => custom.middleName = e.target.value}></Input>
    <span>名</span>
    <Input value={custom.firstName} onChange={e => custom.firstName = e.target.value}></Input>
    <Button onClick={() => {
      form.validateFieldsAndScroll(err => {
        if (err) {
          return
        }
        if (custom.id) {
          ajaxPost("/custom", custom).then(res => {
          })
        } else {
          ajaxPost("/custom/create", custom).then(res => {
            if (_.isArray(res.data)) {
              // 选择一个已存在用户
              customs.replace(res.data)
            } else {
              // 创建成功，直接创建order
              createOrder(custom)
            }
          })
        }
      })
    }}>保存客户信息</Button>
    <CustomSelect custom={custom} customs={customs.slice()}></CustomSelect>
  </div>
}), "custom")


export default PageAirOrder