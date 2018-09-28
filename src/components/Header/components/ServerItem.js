import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

class ServerItem extends React.Component {
  render() {
    const { server } = this.props;

    const tooltipId = `server-${server.name}-status-tooltip`;

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
          {server.settings.path}
        </ReactTooltip>
      </a>
    );
  }
}

ServerItem.propTypes = {
  server: PropTypes.object.isRequired
};

export default ServerItem;
