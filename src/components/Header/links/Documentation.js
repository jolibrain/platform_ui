import React from "react";

class Documentation extends React.Component {
  render() {
    return (
      <li id="documentation-link" className="nav-item">
        <a
          href="https://www.deepdetect.com/platform/docs/"
          target="_blank"
          rel="noreferrer noopener"
          className="nav-link"
        >
          <i className="fas fa-book" />
          &nbsp; Documentation
        </a>
      </li>
    );
  }
}

export default Documentation;
