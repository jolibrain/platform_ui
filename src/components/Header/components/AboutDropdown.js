import React from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";

@inject("buildInfoStore")
@observer
class AboutDropdown extends React.Component {
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
    const { buildInfoStore } = this.props;

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
          className={`dropdown-menu ${this.state.aboutDown ? "show" : ""}`}
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
    );
  }
}

AboutDropdown.propTypes = {};

export default AboutDropdown;
