import React from "react";

class MenuItem extends React.Component {
  render() {
    const { name, icon, link } = this.props;

    return (
      <a
        className="dropdown-item"
        href={link}
        style={{ cursor: "pointer" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {typeof icon !== "undefined" ? (
          <span>
            <i className={icon} />&nbsp;
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
