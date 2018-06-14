import React from "react";
import { inject } from "mobx-react";

import CurlCommand from "./CurlCommand";
import JsonResponse from "./JsonResponse";

@inject("imaginateStore")
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
    const image = this.props.image;

    if (typeof image === "undefined" || !image) return null;

    const json = image.json;

    if (typeof json === "undefined" || !json) return null;

    return (
      <div className="card commands">
        <div className="card-header">
          {json.head && json.head.time && json.head.time > 0 ? (
            <span className="badge badge-secondary float-right">
              {json.head.time}ms
            </span>
          ) : (
            ""
          )}
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a
                className={
                  this.state.tab === "curl" ? "nav-link active" : "nav-link"
                }
                onClick={this.setTab.bind(this, "curl")}
              >
                Curl&nbsp;
                {this.props.isRequesting ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  ""
                )}
              </a>
            </li>

            <li className="nav-item">
              <a
                className={
                  this.state.tab === "json" ? "nav-link active" : "nav-link"
                }
                onClick={this.setTab.bind(this, "json")}
              >
                JSON&nbsp;
                {json.status.code === 500 ? (
                  <i className="fas fa-exclamation-triangle" />
                ) : (
                  ""
                )}
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {this.state.tab === "curl" ? <CurlCommand /> : <JsonResponse />}
        </div>
      </div>
    );
  }
}
