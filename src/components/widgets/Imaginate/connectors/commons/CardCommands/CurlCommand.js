import React from "react";
import { inject, observer } from "mobx-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/styles/hljs";
import ReactTooltip from "react-tooltip";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
@inject("deepdetectStore")
@observer
export default class CurlCommand extends React.Component {
  constructor(props) {
    super(props);

    const { service } = this.props.imaginateStore;

    this.state = {
      copied: false,
      jsonConfig: service.selectedInput.postData
    };

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
    this.handleCurlChange = this.handleCurlChange.bind(this);
    this.curlCommand = this.curlCommand.bind(this);
  }

  curlCommand() {
    const { service } = this.props.imaginateStore;
    return `curl -X POST '${window.location.origin}${
      service.serverSettings.path
    }/predict' -d '${JSON.stringify(this.state.jsonConfig, null, 1)}'`;
  }

  componentWillReceiveProps(nextProps) {
    const { service } = this.props.imaginateStore;
    this.setState({ jsonConfig: service.selectedInput.postData });
    ReactTooltip.rebuild();
  }

  handleCurlChange(editor, data, value) {
    const { service } = this.props.imaginateStore;
    const curlCommand = `curl -X POST '${window.location.origin}${
      service.serverSettings.path
    }/predict' -d '`;

    const jsonConfig = value.replace(curlCommand, "").slice(0, -1);
    this.setState({ jsonConfig: jsonConfig });
  }

  handleCopyClipboard() {
    copy(this.curlCommand());

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 500);
  }

  render() {
    const { service } = this.props.imaginateStore;

    if (service.selectedInput === null) return null;

    const copiedText = this.state.copied ? "Copied!" : "Copy to clipboard";
    //<CodeMirror
    //      value={this.curlCommand()}
    //      onBeforeChange={this.handleCurlChange}
    //      onChange={this.handleCurlChange}
    //      options={{
    //        smartIndent: false
    //      }}
    //    />

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
          {this.curlCommand()}
        </SyntaxHighlighter>
      </div>
    );
  }
}
