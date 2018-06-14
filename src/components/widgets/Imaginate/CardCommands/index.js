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
    const store = this.props.imaginateStore;

    return (
      <div
        className="card commands"
        style={{
          display: store.selectedImage === null ? "none" : "flex"
        }}
      >
        <div className="card-header">
          {store.selectedImage &&
          store.selectedImage.json &&
          store.selectedImage.json.head &&
          store.selectedImage.json.head.time &&
          store.selectedImage.json.head.time > 0 ? (
            <span className="badge badge-secondary float-right">
              {store.selectedImage.json.head.time}ms
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
                {store.isRequesting ? (
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
                {store.selectedImage &&
                store.selectedImage.json &&
                store.selectedImage.json.status.code === 500 ? (
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
