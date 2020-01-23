import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";

@inject("configStore")
class Dataset extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("LinkDataset")) return null;

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
