import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";

@inject("configStore")
class Predict extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("Predict")) return null;

    return (
      <li id="predict-link">
        <Link to="/predict" style={{ textDecoration: "none" }}>
          <i className="fas fa-cube" />&nbsp; Predict
        </Link>
      </li>
    );
  }
}

export default Predict;
