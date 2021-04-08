import React from "react";
import { Link } from "react-router-dom";

class Predict extends React.Component {
  render() {
    const predictPatt = /^#\/predict/g;
    const selectedItem = predictPatt.test(window.location.hash);

    return (
      <li id="predict-link" className={selectedItem ? "selected" : ""}>
        <Link to="/predict" style={{ textDecoration: "none" }}>
          <i className="fas fa-cube" />
          &nbsp; Predict
        </Link>
      </li>
    );
  }
}

export default Predict;
