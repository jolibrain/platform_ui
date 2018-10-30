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
  }

  handleUserClick() {
    this.setState({ userDown: !this.state.userDown });
  }

  handleLogout() {
    // TODO
  }

  render() {
    const username = this.props.cookies.get("username");

    if (!username) return null;

    return (
      <li className="nav-item dropdown" id="user-dropdown">
        <a
          className="nav-link dropdown-toggle"
          style={{ cursor: "pointer" }}
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={this.handleUserClick}
        >
          <i class="fas fa-user" />&nbsp;{username}
        </a>
        <div
          className={`dropdown-menu ${this.state.userDown ? "show" : ""}`}
          aria-labelledby="navbarDropdown"
        >
          <a
            className="dropdown-item"
            onClick={this.handleLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </a>
        </div>
      </li>
    );
  }
}

UserDropdown.propTypes = {
  cookies: PropTypes.object.isRequired
};

export default withCookies(UserDropdown);
