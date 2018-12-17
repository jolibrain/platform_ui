import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";

@inject("configStore")
class Predict extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("Predict")) return null;

    const predictPatt = /^#\/predict/g;
    const selectedItem = predictPatt.test(window.location.hash);

    return (
      <li id="predict-link" className={selectedItem ? "selected" : ""}>
        <Link to="/predict" style={{ textDecoration: "none" }}>
          <i className="fas fa-cube" />&nbsp; Predict
        </Link>
      </li>
    );
  }
}

export default Predict;
