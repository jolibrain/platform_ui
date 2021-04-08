import React from "react";
import { Link } from "react-router-dom";

class Dataset extends React.Component {
  render() {
    const datasetPatt = /^#\/datasets/g;
    const selectedItem = datasetPatt.test(window.location.hash);

    return (
      <li id="dataset-link" className={selectedItem ? "selected" : ""}>
        <Link to="/datasets" style={{ textDecoration: "none" }}>
          <i className="fas fa-asterisk" />
          &nbsp; Datasets
        </Link>
      </li>
    );
  }
}

export default Dataset;
