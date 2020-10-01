import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";
import ServiceCardList from "../../widgets/ServiceCardList";

@inject("datasetStore")
@inject("deepdetectStore")
@inject("configstore")
@inject("gpustore")
@withRouter
@observer
class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterDatasetName: ""
    };

    this.handleDatasetFilter = this.handleDatasetFilter.bind(this);
    this.cleanDatasetFilter = this.cleanDatasetFilter.bind(this);
  }

  handleDatasetFilter(event) {
    this.setState({ filterServiceName: event.target.value });
  }

  cleanDatasetFilter(event) {
    this.setState({ filterServiceName: "" });
  }

  handleClickLayoutCards() {
    this.setState({ predictLayout: "cards" });
  }

  handleClickLayoutList() {
    this.setState({ predictLayout: "list" });
  }

  render() {
    const { datasetStore } = this.props;
    const { filterDatasetName } = this.state;

    let { datasets } = datasetStore;

    if (filterDatasetName && filterDatasetName.length > 0) {
      datasets = datasets.filter(r => {
        return r.name.includes(filterDatasetName);
      });
    }

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof this.props.configStore.gpuInfo !== "undefined" &&
        this.props.gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
        <div className="container-fluid">
          <div className="page-title p-4 row">
            <div className="col-lg-3 col-md-6">
              <h3>{datasets.length}</h3>
              <h4>
                <i className="fas fa-asterisk" /> Datasets
              </h4>
            </div>

            <div className="col-lg-3 col-md-6"></div>

            <div className="col-lg-6 col-md-12 pb-2">
              <form className="form-inline">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fas fa-search" />
                    </div>
                  </div>
                  <input
                    type="text"
                    onChange={this.handleDatasetFilter}
                    placeholder="Filter dataset name..."
                    value={this.state.filterDatasetName}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={this.cleanDatasetFilter}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="content">
            <div className="datasetList">
              <ServiceCardList services={datasets} />
            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
export default MainView;
