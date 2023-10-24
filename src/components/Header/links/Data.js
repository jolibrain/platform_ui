import React from "react";
import { observer } from "mobx-react";

import stores from "../../../stores/rootStore";

const Data = observer(class Data extends React.Component {
  render() {
    const { configStore } = stores;

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
          <i className="fas fa-save" />
          &nbsp; Data
        </a>
      </li>
    );
  }
});

export default Data;
