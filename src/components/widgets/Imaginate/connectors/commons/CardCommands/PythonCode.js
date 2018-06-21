import React from "react";
import { inject, observer } from "mobx-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/styles/hljs";
import ReactTooltip from "react-tooltip";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
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
    const { service } = this.props.imaginateStore;

    const postData = service.selectedInput.postData;

    let pythonCode = "";

    if (postData.parameters.input) {
      pythonCode += `parameters_input = ${JSON.stringify(
        postData.parameters.input
      )}\n`;
    } else {
      pythonCode += `parameters_input = {}\n`;
    }

    if (postData.parameters.mlllib) {
      pythonCode += `parameters_mllib = ${JSON.stringify(
        postData.parameters.mllib
      )}\n`;
    } else {
      pythonCode += `parameters_mllib = {}\n`;
    }

    if (postData.parameters.output) {
      pythonCode += `parameters_output = ${JSON.stringify(
        postData.parameters.output
      )}\n`;
    } else {
      pythonCode += `parameters_output = {}\n`;
    }

    pythonCode += `data = ${JSON.stringify(postData.data)}\n`;
    pythonCode += `sname = '${service.name}'\n`;
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
