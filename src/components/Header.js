import React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import ReactTooltip from "react-tooltip";
import moment from "moment";

//import Keycloak from "keycloak-js";

@inject("configStore")
@inject("buildInfoStore")
@inject("deepdetectStore")
@inject("authTokenStore")
@observer
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aboutDown: false
    };

    this.handleAboutClick = this.handleAboutClick.bind(this);
  }

  handleAboutClick() {
    this.setState({ aboutDown: !this.state.aboutDown });
  }

  render() {
    const { buildInfoStore, deepdetectStore } = this.props;
    const servers = deepdetectStore.servers;

    let buildInfo = null;
    if (buildInfoStore.isReady) {
      buildInfo = (
        <div>
          <div className="dropdown-divider" />
          <a
            className="dropdown-item"
            href={`https://gitlab.com/jolibrain/core-ui/commits/master`}
          >
            Build {buildInfoStore.buildCommitHash.slice(0, 6)}
            <br />
            updated {moment.unix(buildInfoStore.buildDate).fromNow()}
          </a>
        </div>
      );
    }

    return (
      <header className="header navbar navbar-dark bg-dark" id="header">
        <div className="container-fluid">
          <div className="header-content">
            <div className="title-container">
              <h1 className="title">
                <Link to="/">{this.props.configStore.common.name}</Link>
              </h1>

              <ul className="list-unstyled navbar-sub-nav">
                {this.props.configStore.isComponentBlacklisted("Predict") ? (
                  ""
                ) : (
                  <li>
                    <Link to="/predict" style={{ textDecoration: "none" }}>
                      <i className="fas fa-cube" />&nbsp; Predict
                    </Link>
                  </li>
                )}

                {this.props.configStore.isComponentBlacklisted("Training") ? (
                  ""
                ) : (
                  <li>
                    <Link to="/training" style={{ textDecoration: "none" }}>
                      <i className="fas fa-braille" />&nbsp; Training
                    </Link>
                  </li>
                )}

                <li>
                  <span className="separator">|</span>
                </li>

                {this.props.configStore.isComponentBlacklisted(
                  "LinkJupyter"
                ) ? (
                  ""
                ) : (
                  <li>
                    <a
                      href="/code/lab"
                      style={{ textDecoration: "none" }}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <i className="fas fa-circle-notch" />&nbsp; Jupyter
                    </a>
                  </li>
                )}

                {this.props.configStore.isComponentBlacklisted("LinkData") ? (
                  ""
                ) : (
                  <li>
                    <a
                      href="/filebrowser"
                      style={{ textDecoration: "none" }}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <i className="fas fa-save" />&nbsp; Data
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div className="navbar-collapse d-flex justify-content-end">
              <ul className="nav nabar-nav">
                {servers.map((server, index) => {
                  const tooltipId = `server-${index}-status-tooltip`;
                  return (
                    <li
                      className="nav-item server"
                      key={index}
                      data-tip
                      data-for={tooltipId}
                    >
                      <span className="badge badge-primary">
                        {server.name + " "}
                        <i
                          className={
                            server.isDown
                              ? "fas fa-circle serverDown"
                              : "fas fa-circle"
                          }
                        />
                      </span>
                      <ReactTooltip
                        id={tooltipId}
                        place="bottom"
                        effect="solid"
                      >
                        {server.serverDown ? "Server Error" : "Server OK"}
                      </ReactTooltip>
                    </li>
                  );
                })}
                <li className="nav-item">
                  <a
                    href="/docs/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="nav-link"
                  >
                    <i className="fas fa-book" />&nbsp; Documentation
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    style={{ cursor: "pointer" }}
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={this.handleAboutClick}
                  >
                    About
                  </a>
                  <div
                    className={`dropdown-menu ${
                      this.state.aboutDown ? "show" : ""
                    }`}
                    aria-labelledby="navbarDropdown"
                  >
                    <a
                      className="dropdown-item"
                      href="https://gitlab.com/jolibrain/core-ui/"
                    >
                      Gitlab
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="http://deepdetect.com">
                      DeepDetect
                    </a>
                    <a className="dropdown-item" href="http://jolibrain.com">
                      Jolibrain
                    </a>
                    {buildInfo}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
