import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";

@inject("configStore")
class Training extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("Training")) return null;

    return (
      <li id="training-link">
        <Link to="/training" style={{ textDecoration: "none" }}>
          <i className="fas fa-braille" />&nbsp; Training
        </Link>
      </li>
    );
  }
}

export default Training;
