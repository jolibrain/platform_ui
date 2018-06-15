import React from "react";
import { inject, observer } from "mobx-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/styles/hljs";
import ReactTooltip from "react-tooltip";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
@inject("deepdetectStore")
@observer
export default class Pythoncode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    };

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
    this.pythonCode = this.pythonCode.bind(this);
  }

  pythonCode() {
    const store = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    let pythonCode = "";

    if (store.curlParams.parameters.input) {
      pythonCode += `parameters_input = ${JSON.stringify(
        store.curlParams.parameters.input
      )}\n`;
    } else {
      pythonCode += `parameters_input = {}\n`;
    }

    if (store.curlParams.parameters.mlllib) {
      pythonCode += `parameters_mllib = ${JSON.stringify(
        store.curlParams.parameters.mllib
      )}\n`;
    } else {
      pythonCode += `parameters_mllib = {}\n`;
    }

    if (store.curlParams.parameters.output) {
      pythonCode += `parameters_output = ${JSON.stringify(
        store.curlParams.parameters.output
      )}\n`;
    } else {
      pythonCode += `parameters_output = {}\n`;
    }

    console.log(store.curlParams);
    pythonCode += `data = ${JSON.stringify(store.curlParams.data)}\n`;
    pythonCode += `sname = '${ddStore.service.name}'\n`;
    pythonCode += `classif = dd.post_predict(sname,data,parameters_input,parameters_mllib,parameters_output)`;

    return pythonCode;
  }

  componentWillReceiveProps() {
    ReactTooltip.rebuild();
  }

  handleCopyClipboard() {
    copy(this.pythonCode());

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 500);
  }

  render() {
    const store = this.props.imaginateStore;

    if (store.selectedImage === null) return null;

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
        <SyntaxHighlighter
          language="python"
          style={docco}
          className="card-text"
        >
          {this.pythonCode()}
        </SyntaxHighlighter>
      </div>
    );
  }
}
