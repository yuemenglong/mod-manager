import React from "react"
import Head from "next/head"
import dynamic from 'next/dynamic'

let BraftEditor = dynamic(import('braft-editor'), {
  ssr: false // 禁用服务端渲染
});
if (typeof window !== 'undefined' && !!window) {
  BraftEditor = require('braft-editor').default
}

interface Props {
  initValue?: string,
  onChange?: (string) => any
}

class Editor extends React.Component<Props, any> {
  state = {
    editorState: null
  };

  static braft = BraftEditor;

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setState({
      editorState: BraftEditor.createEditorState(this.props.initValue || "")
    })
  }

  render() {
    // noinspection HtmlRequiredTitleElement
    return (
      <div className={'editor'} style={{display:"inline-block",verticalAlign:'top',border:'1px solid #ddd'}}>
        <Head>
          <link rel="stylesheet" type="text/css" href="/static/assets/css/braft-editor.css"/>
        </Head>
        <BraftEditor value={this.state.editorState} onChange={s => {
          this.setState({editorState: s});
          if (this.props.onChange) {
            this.props.onChange(s.toHTML());
          }
        }}/>
      </div>
    )
  }
}

export default Editor;

