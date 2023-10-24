import React from "react";
import { observer } from "mobx-react";
import stores from "../../../stores/rootStore";

const Jupyter = observer(class Jupyter extends React.Component {
  render() {
    const { configStore } = stores;

    let href = "/code/lab";

    if (
      configStore.homeComponent &&
      configStore.homeComponent.headerLinks &&
      configStore.homeComponent.headerLinks.linkJupyter &&
      configStore.homeComponent.headerLinks.linkJupyter.length > 0
    ) {
      href = configStore.homeComponent.headerLinks.linkJupyter;
    }

    return (
      <li id="jupyter-link">
        <a
          href={href}
          style={{ textDecoration: "none" }}
          target="_blank"
          rel="noreferrer noopener"
        >
          <i className="fas fa-circle-notch" />
          &nbsp; Jupyter
        </a>
      </li>
    );
  }
});

export default Jupyter;
