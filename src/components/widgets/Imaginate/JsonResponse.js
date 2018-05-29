import React from "react";
import { inject, observer } from "mobx-react";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
@observer
export default class JsonResponse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    };

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
  }

  handleCopyClipboard() {
    const store = this.props.imaginateStore;

    copy(store.selectedImage.json);

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  }

  render() {
    const store = this.props.imaginateStore;

    if (store.selectedImage === null || store.selectedImage.json === null) {
      return null;
    }

    const jsonContent = store.selectedImage.json;

    const copiedText = this.state.copied ? "Copied!" : "Copy to clipboard";

    return (
      <pre className="curl-command">
        <div className="heading">
          JSON Response
          <span className="clipboard" onClick={this.handleCopyClipboard}>
            {copiedText}
          </span>
        </div>
        <div className="code-wrap">
          <CodeMirror value={JSON.stringify(jsonContent, null, 1)} />
        </div>
      </pre>
    );
  }
}
