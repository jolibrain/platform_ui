import React from "react";
import { inject } from "mobx-react";

@inject("configStore")
class Data extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("LinkData")) return null;

    return (
      <li id="data-link">
        <a
          href="/filebrowser"
          style={{ textDecoration: "none" }}
          target="_blank"
          rel="noreferrer noopener"
        >
          <i className="fas fa-save" />&nbsp; Data
        </a>
      </li>
    );
  }
}

export default Data;
