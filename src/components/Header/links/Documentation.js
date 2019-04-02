import React from "react";
import { inject } from "mobx-react";

@inject("configStore")
class Documentation extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("LinkDocumentation")) return null;

    return (
      <li id="documentation-link" className="nav-item">
        <a
          href="https://www.deepdetect.com/platform/docs/"
          target="_blank"
          rel="noreferrer noopener"
          className="nav-link"
        >
          <i className="fas fa-book" />&nbsp; Documentation
        </a>
      </li>
    );
  }
}

export default Documentation;
