import React from "react";
import { inject, observer } from "mobx-react";

import Header from "./Header";

import CurlCommand from "./CurlCommand";
import JsonResponse from "./JsonResponse";
import PythonCode from "./PythonCode";

@inject("imaginateStore")
@observer
export default class CardCommands extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "curl"
    };

    this.setTab = this.setTab.bind(this);
  }

  setTab(tabName) {
    this.setState({ tab: tabName });
  }

  render() {
    const { service } = this.props.imaginateStore;
    const input = service.selectedInput;

    if (typeof input === "undefined" || !input) return null;

    const json = input.json;

    if (typeof json === "undefined" || !json) return null;

    let cardBody = null;

    switch (this.state.tab) {
      default:
      case "curl":
        cardBody = <CurlCommand />;
        break;
      case "json":
        cardBody = <JsonResponse />;
        break;
      case "python":
        cardBody = <PythonCode />;
        break;
    }

    let requestTime = -1;
    if (json && json.head && json.head.time) {
      requestTime = json.head.time;
    }

    return (
      <div className="card commands">
        <Header
          requestTime={requestTime}
          tab={this.state.tab}
          onTabClick={this.setTab}
          isError={json.status.code === 500}
        />
        <div className="card-body">{cardBody}</div>
      </div>
    );
  }
}
