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

    let buildInfo = null;

    if (buildInfoStore.isReady) {
      const { buildCommitHash, buildDate, branch } = buildInfoStore;

      buildInfo = (
        <div>
          <div className="dropdown-divider" />
          <a
            className="dropdown-item"
            href={`https://gitlab.com/jolibrain/core-ui/commits/${branch}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Build {buildCommitHash.slice(0, 6)}
            <br />
            {branch !== "master" ? (
              <span>
                Branch <i>{branch}</i>
                <br />
              </span>
            ) : (
              ""
            )}
            updated {moment.unix(buildDate).fromNow()}
          </a>
        </div>
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
          About
        </a>
        <div
          className={`dropdown-menu ${this.state.aboutDown ? "show" : ""}`}
          aria-labelledby="navbarDropdown"
        >
          <a
            className="dropdown-item"
            href="https://github.com/jolibrain"
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
          {buildInfo}
        </div>
      </li>
    );
  }
}

AboutDropdown.propTypes = {};

export default AboutDropdown;
