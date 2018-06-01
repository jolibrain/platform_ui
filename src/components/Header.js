import React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

@inject("commonStore")
@inject("deepdetectStore")
@observer
class Header extends React.Component {
  render() {
    const tooltip = (
      <Tooltip id="tooltip">
        <p>
          core-ui
          <ul>
            <li>commit : f60a79</li>
          </ul>
        </p>
        <p>
          deepdetect
          <ul>
            <li>commit : e8592d</li>
          </ul>
        </p>
      </Tooltip>
    );

    const { services } = this.props.deepdetectStore;

    return (
      <header className="header navbar navbar-dark bg-dark" id="header">
        <div className="container-fluid">
          <div className="header-content">
            <div className="title-container">
              <h1 className="title">
                <Link to="/">
                  {this.props.commonStore.appName.toLowerCase()}
                </Link>
              </h1>

              <ul className="list-unstyled navbar-sub-nav">
                <li>
                  <Link
                    to={services.length > 0 ? "/predict" : "/predict/new"}
                    style={{ textDecoration: "none" }}
                  >
                    <FontAwesomeIcon icon="cube" />&nbsp; Predict
                  </Link>
                </li>
              </ul>
            </div>

            <div className="navbar-collapse d-flex justify-content-end">
              <ul className="nav nabar-nav">
                <li>
                  <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <a className="nav-link mr-sm-2">About</a>
                  </OverlayTrigger>
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
