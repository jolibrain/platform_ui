import React from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

import Service from "./Service";

export default class Server extends React.Component {
  render() {
    const server = this.props.server;
    const { services } = server;

    return (
      <li className={this.props.active ? "active" : ""}>
        <span className="nav-item-name">{server.name}</span>
        <ul className="serviceList">
          {services.map((service, index) => {
            return (
              <Service
                service={service}
                active={index === currentServerIndex}
              />
            );
          })}
        </ul>
      </li>
    );
  }
}
