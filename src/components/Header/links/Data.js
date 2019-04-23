import React from "react";
import { inject } from "mobx-react";

@inject("configStore")
class Data extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("LinkData")) return null;

    let href = "/filebrowser";

    if (
      configStore.homeComponent &&
      configStore.homeComponent.headerLinks &&
      configStore.homeComponent.headerLinks.linkData &&
      configStore.homeComponent.headerLinks.linkData.length > 0
    ) {
      href = configStore.homeComponent.headerLinks.linkData;
    }

    return (
      <li id="data-link">
        <a
          href={href}
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
