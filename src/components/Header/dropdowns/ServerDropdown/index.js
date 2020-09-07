/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { inject, observer } from "mobx-react";

import Item from "./Item";

@inject("deepdetectStore")
@observer
class ServerDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listDown: false
    };

    this.handleListClick = this.handleListClick.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.state.listDown
    ) {
      this.setState({ listDown: false });
    }
  }

  handleListClick() {
    this.setState({ listDown: !this.state.listDown });
  }

  render() {
    const { deepdetectStore } = this.props;
    const servers = deepdetectStore.servers;

    const serversState = servers.map(s => s.isDown);
    let badge = <i className="servers-ok fas fa-clone" />;

    if (!deepdetectStore.isReady) {
      // deepdetectStore is loading
      badge = <i className="servers-loading fas fa-spinner fa-spin" />;
    } else if (serversState.includes(true)) {
      // some servers are down
      badge = <i className="servers-ok fas fa-clone warning" />;
    }

    // All servers are down
    if (!serversState.includes(false)) {
      badge = <i className="servers-down fas fa-clone" />;
    }

    return (
      <li
        id="servers-dropdown"
        className="nav-item dropdown"
        ref={this.setWrapperRef}
      >
        <a
          className="nav-link dropdown-toggle"
          style={{ cursor: "pointer" }}
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={this.handleListClick}
        >
          {badge}
          Servers
        </a>
        <div
          className={`dropdown-menu ${this.state.listDown ? "show" : ""}`}
          aria-labelledby="navbarDropdown"
        >
          {servers.map((server, index) => {
            return <Item key={`server-${index}`} server={server} />;
          })}
        </div>
      </li>
    );
  }
}

export default ServerDropdown;
