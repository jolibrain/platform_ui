/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@withRouter
@observer
class DatasetItem extends React.Component {
  render() {
    const dataset = this.props.dataset;

    if (!dataset) return null;

    return (
      <div className="col-lg-4 col-md-12 my-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              <span className="title">
                <i className="fas fa-asterisk" /> {dataset.name}
              </span>
            </h5>

            <div className="row process-icons"></div>
          </div>

          <div className="card-footer text-right">
            <a className="btn btn-primary">
              View <i className="fas fa-chevron-right" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

DatasetItem.propTypes = {
  repository: PropTypes.object
};
export default DatasetItem;
