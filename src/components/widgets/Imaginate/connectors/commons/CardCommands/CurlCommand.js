import React from "react";
import { inject, observer } from "mobx-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/styles/hljs";
import ReactTooltip from "react-tooltip";
import { withCookies } from "react-cookie";

//import { Controlled as CodeMirror } from "react-codemirror2";
//import "codemirror/lib/codemirror.css";
//import "codemirror/mode/javascript/javascript";

import copy from "copy-to-clipboard";

@inject("imaginateStore")
@inject("deepdetectStore")
@inject("authTokenStore")
@observer
class CurlCommand extends React.Component {
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
    const { cookies } = this.props;

    let command = ["curl"];

    command.push("-X POST");
    command.push(
      `'${window.location.origin}${service.serverSettings.path}/predict'`
    );
    command.push(`-d '${JSON.stringify(this.state.jsonConfig, null, 1)}'`);

    const session = cookies.get("session");
    if (session) {
      command.push(`-H "Cookie: session=${session}"`);
      command.push(`-H "Accept-Encoding: gzip, deflate, br"`);
      command.push(`-H "Accept: */*"`);
      command.push(`-H "Accept-Language: en-US,en;q=0.9"`);
      command.push(`-H "User-Agent: ${window.navigator.userAgent}"`);
      command.push(`-H "Referer: ${window.location.origin}"`);
      command.push(`--compressed`);
    }

    const token = cookies.get("accesstoken");
    if (token) {
      command.push(`-H "Authorization: Bearer ${token}"`);
    }

    return command.join(" ");
  }

  componentWillReceiveProps(nextProps) {
    // Note about issue #54 - editable Curl command from interface
    // Moving to CodeMirror is tricky because it'd call componentWillReceiveProps
    // so you don't know if you need to update the curlCommand or not
    // Would it need to be moved to a children Component ?
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

export default withCookies(CurlCommand);
