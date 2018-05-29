import React from "react";
import { inject, observer } from "mobx-react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
@observer
export default class CurlCommand extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    };

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
  }

  handleCopyClipboard() {
    const store = this.props.imaginateStore;
    const curlCommand = `curl -X POST 'http://localhost:8000/predict' -d '${
      store.curlParams
    }'`;

    copy(curlCommand);

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 500);
  }

  render() {
    const store = this.props.imaginateStore;

    if (store.selectedImage === null) return null;

    const curlCommand = `curl -X POST 'http://localhost:8000/predict' -d '${JSON.stringify(
      store.curlParams,
      null,
      1
    )}'`;

    const copiedText = this.state.copied ? "Copied!" : "Copy to clipboard";

    return (
      <pre className="curl-command">
        <div className="heading">
          CURL{" "}
          {store.isRequesting ? <FontAwesomeIcon icon="spinner" spin /> : ""}
          <span className="clipboard" onClick={this.handleCopyClipboard}>
            {copiedText}
          </span>
        </div>
        <div className="code-wrap">
          <CodeMirror value={curlCommand} />
        </div>
      </pre>
    );
  }
}
