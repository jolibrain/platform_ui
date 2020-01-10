import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withCookies } from "react-cookie";

@inject("configStore")
@observer
class UserDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userDown: false
    };

    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

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
      this.state.userDown
    ) {
      this.setState({ userDown: false });
    }
  }

  handleUserClick() {
    this.setState({ userDown: !this.state.userDown });
  }

  handleLogout() {
    // TODO
    // https://gitlab.com/jolibrain/core-ui/issues/265
  }

  render() {
    const username = this.props.cookies.get("username");

    if (!username) return null;

    return (
      <li
        id="user-dropdown"
        className="nav-item dropdown"
        ref={this.setWrapperRef}
      >
        <a
          className="nav-link"
          style={{ cursor: "pointer" }}
          id="navbarDropdown"
        >
          <i className="fas fa-user" />
          &nbsp;{username}
        </a>
      </li>
    );

    // TODO add logout dropdown:

    //    return (
    //      <li className="nav-item dropdown" id="user-dropdown">
    //        <a
    //          className="nav-link dropdown-toggle"
    //          style={{ cursor: "pointer" }}
    //          id="navbarDropdown"
    //          role="button"
    //          data-toggle="dropdown"
    //          aria-haspopup="true"
    //          aria-expanded="false"
    //          onClick={this.handleUserClick}
    //        >
    //          <i className="fas fa-user" />&nbsp;{username}
    //        </a>
    //        <div
    //          className={`dropdown-menu ${this.state.userDown ? "show" : ""}`}
    //          aria-labelledby="navbarDropdown"
    //        >
    //          <a
    //            className="dropdown-item"
    //            onClick={this.handleLogout}
    //            style={{ cursor: "pointer" }}
    //          >
    //            Logout
    //          </a>
    //        </div>
    //      </li>
    //    );
  }
}

UserDropdown.propTypes = {
  cookies: PropTypes.object.isRequired
};

export default withCookies(UserDropdown);
