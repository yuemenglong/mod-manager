import React from "react"
import Head from "next/head"
import * as _ from "lodash"
import { Button, Input } from "antd";
import { fetchData } from "../framework/ajax";
import { KeCheng, KeJian, FileMeta } from "../entity/entity";
import { watchMobxDeep, useMobx } from "../framework/hooks";
import { observer } from "mobx-react";
import TextArea from "antd/lib/input/TextArea";

const Content = observer(() => {
  let [kc, kcSet] = useMobx(new KeCheng())
  watchMobxDeep(kc)
  return <div>
    <Head>
      <link href="https://cdn.bootcdn.net/ajax/libs/antd/3.26.15/antd.min.css" rel="stylesheet" />
    </Head>
    <h1>Test</h1>
    <Input value={kc.desc} onChange={e => kc.desc = e.target.value}></Input>
    {
      kc.keJianList.map(item => {
        return <Input value={item.desc} onChange={e => item.desc = e.target.value}></Input>
      })
    }
    <Button onClick={() => {
      kc.keJianList.push(new KeJian())
    }}>AddList</Button>
    <Button onClick={() => {
      kcSet(_.merge(new KeCheng(), { bigImage: new FileMeta() }))
    }}>SetNew</Button>
    <TextArea rows={20} value={JSON.stringify(kc)}></TextArea>
  </div>
})

const Test = () => {
  return <Content></Content>
};

// Test.getInitialProps = (ctx) => {
//   return fetchData({
//     data: "/test/data",
//     test: "/test",
//   }, ctx)
// }

export default Test  