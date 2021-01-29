/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { inject, observer } from "mobx-react";

@inject("buildInfoStore")
@observer
class AboutDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aboutDown: false
    };

    this.handleAboutClick = this.handleAboutClick.bind(this);

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
      this.state.aboutDown
    ) {
      this.setState({ aboutDown: false });
    }
  }

  handleAboutClick() {
    this.setState({ aboutDown: !this.state.aboutDown });
  }

  render() {
    const { buildInfoStore } = this.props;

    let versionInfo = null;
    let updateInfo = null;

    if (buildInfoStore.version) {
      versionInfo = (
        <>
          <div className="dropdown-divider" />
          <a
            className="dropdown-item version-link"
            href="https://hub.docker.com/r/jolibrain/platform_ui/tags"
            target="_blank"
            rel="noopener noreferrer"
          >
            Current version: ${buildInfoStore.version}
          </a>
        </>
      );
    }

    if (buildInfoStore.isUpdatable) {
      updateInfo = (
        <>
          <div className="dropdown-divider" />
          <a
            className="dropdown-item update-link"
            href="https://deepdetect.com/quickstart-platform/#update"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="badge badge-secondary">{buildInfoStore.latestDockerTag}</span>
            &nbsp; Update Available
          </a>
        </>
      );
    }

    return (
      <li
        id="about-dropdown"
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
          onClick={this.handleAboutClick}
        >
          {buildInfoStore.isUpdatable ? (
            <i className="fas fa-flag update-available" />
          ) : (
            ""
          )}
          &nbsp;About
        </a>
        <div
          className={`dropdown-menu ${this.state.aboutDown ? "show" : ""}`}
          aria-labelledby="navbarDropdown"
        >
          <a
            className="dropdown-item"
            href="https://github.com/jolibrain/platform_ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github" /> Github
          </a>
          <div className="dropdown-divider" />
          <a
            className="dropdown-item"
            href="http://deepdetect.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            DeepDetect
          </a>
          <a
            className="dropdown-item"
            href="http://jolibrain.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jolibrain
          </a>
          {versionInfo}
          {updateInfo}
        </div>
      </li>
    );
  }
}

AboutDropdown.propTypes = {};

export default AboutDropdown;
