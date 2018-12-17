import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";

@inject("configStore")
class Training extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("Training")) return null;

    const trainingPatt = /^#\/training/g;
    const selectedItem = trainingPatt.test(window.location.hash);

    return (
      <li id="training-link" className={selectedItem ? "selected" : ""}>
        <Link to="/training" style={{ textDecoration: "none" }}>
          <i className="fas fa-braille" />&nbsp; Training
        </Link>
      </li>
    );
  }
}

export default Training;
