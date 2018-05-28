import React from "react";
import { inject, observer } from "mobx-react";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

import { CopyToClipboard } from "react-copy-to-clipboard";

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
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  }

  render() {
    const store = this.props.imaginateStore;

    if (store.selectedImage === null) return null;

    const jsonContent = store.selectedImage.json;

    let copiedClass = "btn btn-sm btn-outline-secondary";
    let copiedText = "Copy to clipboard";

    if (this.state.copied === true) {
      copiedClass = "btn btn-sm btn-outline-success";
      copiedText = "Copied";
    }

    return (
      <div>
        <h6>
          JSON response&nbsp;
          <CopyToClipboard text={jsonContent} onCopy={this.handleCopyClipboard}>
            <button type="button" className={copiedClass}>
              {copiedText}
            </button>
          </CopyToClipboard>
        </h6>
        <CodeMirror value={JSON.stringify(jsonContent, null, 1)} />
      </div>
    );
  }
}
