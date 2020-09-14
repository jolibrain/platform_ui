import React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import ReactTooltip from "react-tooltip";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
@observer
class JsonResponse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    };

    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
    this.cleanLargeJson = this.cleanLargeJson.bind(this);
  }

  handleCopyClipboard() {
    const { service } = this.props.imaginateStore;

    copy(JSON.stringify(service.selectedInput.json, null, 2));

    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  }

  cleanLargeJson(json) {
    Object.keys(json).forEach(prop => {
      const propType = {}.toString.apply(json[prop]);
      switch (propType) {
        case "[object Object]":
          this.cleanLargeJson(json[prop]);
          break;
        case "[object Array]":
          if (json[prop].length > 100) {
            json[prop] = json[prop].slice(0, 100);
            json[prop].push("...");
          }
          break;
        default:
          break;
      }
    });
    return json;
  }

  render() {
    const { service } = this.props.imaginateStore;
    const selectedInput = service.selectedInput;

    if (!selectedInput || !selectedInput.json) {
      return null;
    }

    const copiedText = this.state.copied ? "Copied!" : "Copy to clipboard";

    let json = toJS(selectedInput.json);

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
          language="json"
          style={docco}
          className={this.props.isError ? "card-text card-error" : "card-text"}
        >
          {JSON.stringify(json, null, 1)}
        </SyntaxHighlighter>
      </div>
    );
  }
}
export default JsonResponse;
