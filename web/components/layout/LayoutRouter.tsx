import React, { } from "react";
import * as _ from "lodash";
const rewriteUrl = require("../../site.config").rewriteUrl

let LayoutRouter = ((props): any => {
  // let pathname = rewriteUrl(useRouter().asPath)
  return props.children
}) as any

LayoutRouter.getInitialProps = (ctx) => {
    return {}
}

export default LayoutRouter;