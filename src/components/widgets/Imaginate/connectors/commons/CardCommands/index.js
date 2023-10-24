import React from "react";
import { observer } from "mobx-react";

import Header from "./Header";

import CurlCommand from "./CurlCommand";
import JsonResponse from "./JsonResponse";
import Code from "./Code";

import stores from "../../../../../../stores/rootStore";

const CardCommands = observer(class CardCommands extends React.Component {
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
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    const input = service.selectedInput;

    if (typeof input === "undefined" || !input) return null;
    const json = input.json;

    let cardBody = null;

    const isError =
      !service.isRequesting &&
      (!json ||
        !json.status ||
        !json.status.code ||
        [400, 500].includes(json.status.code));

    switch (this.state.tab) {
      default:
      case "curl":
        cardBody = <CurlCommand />;
        break;
      case "json":
        cardBody = <JsonResponse isError={isError} />;
        break;
      case "code":
        cardBody = <Code />;
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
          isError={isError}
          isRequesting={service.isRequesting}
        />
        <div className="card-body">{cardBody}</div>
      </div>
    );
  }
});
export default CardCommands;
