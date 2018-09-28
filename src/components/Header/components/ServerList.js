import React from "react";
import { inject, observer } from "mobx-react";

import ServerItem from "./ServerItem";

@inject("deepdetectStore")
@observer
class ServerList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listDown: false
    };

    this.handleListClick = this.handleListClick.bind(this);
  }

  handleListClick() {
    this.setState({ listDown: !this.state.listDown });
  }

  render() {
    const { deepdetectStore } = this.props;
    const servers = deepdetectStore.servers;

    const serversState = servers.map(s => s.isDown);
    let badge = <i className="servers-ok fas fa-clone" />;

    // some servers are down
    if (serversState.includes(true)) {
      badge = (
        <span className="fa-stack">
          <i className="fas fa-clone fa-stack-1x" />
          <i className="far fa-clone fa-stack-1x" />
        </span>
      );
    }

    // All servers are down
    if (!serversState.includes(false)) {
      badge = <i className="servers-down fas fa-clone" />;
    }

    return (
      <li id="servers-dropdown" className="nav-item dropdown">
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
            return <ServerItem key={`server-${index}`} server={server} />;
          })}
        </div>
      </li>
    );
  }
}

export default ServerList;
