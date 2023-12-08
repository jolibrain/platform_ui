import React from "react";
import ReactTooltip from "react-tooltip";

class Item extends React.Component {
  render() {
    const { server } = this.props;
    const { settings } = server;

    const tooltipId = `server-${server.name}-status-tooltip`;

    const serverTooltip = (
      <div className="server-details">
        <div className="d-flex mb-2">
          <i className="fas fa-caret-right" /> Host{" "}
          <span className="ml-auto">
            {settings.host || window.location.hostname}
          </span>
        </div>
        <div className="d-flex mb-2">
          <i className="fas fa-caret-right" /> Port{" "}
          <span className="ml-auto">
            {settings.port || window.location.port}
          </span>
        </div>
        <div className="d-flex mb-2 last">
          <i className="fas fa-caret-right" /> Path{" "}
          <span className="ml-auto ps-2">{settings.path}</span>
        </div>
      </div>
    );

    return (
      <a
        id={`server-item-${server.name}`}
        className="dropdown-item server"
        data-for={tooltipId}
        data-tip
        href={server.infoPath}
        target="_blank"
        rel="noreferrer noopener"
      >
        <i
          className={
            server.isDown ? "fas fa-square serverDown" : "fas fa-square"
          }
        />
        &nbsp;
        {server.name}
        <ReactTooltip id={tooltipId} place="left" effect="solid">
          {serverTooltip}
        </ReactTooltip>
      </a>
    );
  }
}
export default Item;
