import React from "react";

class MenuItem extends React.Component {
  render() {
    const { name, icon, url } = this.props;

    return (
      <a
        className={this.props.isDropdownItem ? "dropdown-item" : "nav-link"}
        href={url}
        style={{ cursor: "pointer" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {typeof icon !== "undefined" ? (
          <span>
            <i className={icon} />
            &nbsp;
          </span>
        ) : (
          ""
        )}
        {name}
      </a>
    );
  }
}

export default MenuItem;
