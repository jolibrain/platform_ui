import React from "react";
import { inject, observer } from "mobx-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/styles/hljs";
import ReactTooltip from "react-tooltip";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
@inject("deepdetectStore")
@observer
export default class CurlCommand extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    };

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
  }

  componentWillReceiveProps() {
    ReactTooltip.rebuild();
  }

  handleCopyClipboard() {
    const store = this.props.imaginateStore;
    const { settings } = this.props.deepdetectStore;
    const curlCommand = `curl -X POST '${window.location.origin}${
      settings.server.path
    }/predict' -d '${JSON.stringify(store.curlParams)}'`;

    copy(curlCommand);

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 500);
  }

  render() {
    const store = this.props.imaginateStore;
    const { settings } = this.props.deepdetectStore;

    if (store.selectedImage === null) return null;

    const curlCommand = `curl -X POST '${window.location.origin}${
      settings.server.path
    }/predict' -d '${JSON.stringify(store.curlParams, null, 1)}'`;

    const copiedText = this.state.copied ? "Copied!" : "Copy to clipboard";

    return (
      <div>
        <div className="bd-clipboard">
          <button
            className="btn-clipboard"
            title=""
            data-tip
            data-for="copy-tooltip"
            data-iscapture={true}
            onClick={this.handleCopyClipboard}
          >
            Copy
          </button>
          <ReactTooltip
            id="copy-tooltip"
            effect="solid"
            getContent={() => copiedText}
          />
        </div>
        <SyntaxHighlighter language="bash" style={docco} className="card-text">
          {curlCommand}
        </SyntaxHighlighter>
      </div>
    );
  }
}
