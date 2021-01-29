/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

/*
 * # Workflow: publishing after training"
 *
 * Documentation of the process triggered by this modal:
 * it fetches the selected service `config.json` and modifies it:
 * `model.repository` to `privateStore.systemPath + privateStore.nginxPath + service.name`
 * `model.create_repository`` to `true`
 * `parameters.output.store_config` to `true`
 * `parameters.mllib.from_repository` to `service.location`
 * it deletes value at `parameters.mllib.template`
 * it creates a new service on the hostable server
 * it deletes the existing service from the training server
 */

@withRouter
@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@inject("modalStore")
@observer
class ModelRepositoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPublishing: false,
      publishError: null,
      compareSelected: false
    };

    this.getValue = this.getValue.bind(this);
    this.toggleCompareState = this.toggleCompareState.bind(this);

    this.openPublishTrainingModal = this.openPublishTrainingModal.bind(this);
    this.deleteRepositoryModal = this.deleteRepositoryModal.bind(this);
  }

  toggleCompareState() {
    const { service } = this.props;
    this.setState({ compareSelected: !this.state.compareSelected });
    this.props.handleCompareStateChange(service.path);
  }

  openPublishTrainingModal() {
    const { modalStore } = this.props;
    modalStore.setVisible("publishTraining", true, {
      service: this.props.service
    });
  }

  deleteRepositoryModal() {
    const { modalStore } = this.props;
    modalStore.setVisible("deleteRepository", true, {
      service: this.props.service
    });
  }

  getValue(service, attr) {
    if (!service.jsonMetrics) return null;

    const { measure, measure_hist } = service.jsonMetrics.body;

    let value = null;

    if (measure) {
      value = measure[attr];
    } else if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value =
        measure_hist[`${attr}_hist`][measure_hist[`${attr}_hist`].length - 1];
    }

    if (attr !== "remain_time_str" && value) {
      if (attr === "train_loss") {
        value = value.toFixed(10);
      } else {
        value = value.toFixed(5);
      }
    }

    return value;
  }

  render() {
    const { service } = this.props;

    if (!service) return null;

    const archiveUrl = `/charts/archive${service.path}`;

    let serviceData = [...this.props.columns]

    serviceData = serviceData.filter(column => !column.hide)
        .map((data, index) => {

          let content = null

          if(data.type && data.type === "selector") {
            content = (
              <input
                type="checkbox"
                onClick={this.toggleCompareState}
              />
            )
          } else if (data.isAction) {

            let publishButton = service.jsonConfig ? (
              <>
                <br/>
                <a
                  onClick={this.openPublishTrainingModal}
                  className="btn btn-outline-primary"
                >
                  <i className="fas fa-plus" /> Publish
                </a>
              </>
            ) : null;

            if (this.state.isPublishing) {
              publishButton = (
                <>
                  <br/>
                  <a className="btn btn-outline-primary">
                    <i className="fas fa-spinner fa-spin" /> Publishing...
                  </a>
                </>
              );
            }

            let deleteButton = (
              <>
                <br/>
                <a
                  onClick={this.deleteRepositoryModal}
                  className="btn btn-outline-danger"
                >
                  <i className="fas fa-trash" /> Delete
                </a>
              </>
            )
            // TODO: finish agent.js
            deleteButton = null;

            content = (
              <>
              <Link to={archiveUrl} className="btn btn-primary">
                View <i className="fas fa-chevron-right" />
              </Link>
              {publishButton}
              {deleteButton}
              </>
            )

          } else if (data.selector) {

            let value = null

            if (data.isValue) {
              value = this.getValue(service, data.selector);
            } else {
              value = service[data.selector];
            }

            content = (
              <span>{
                data.formatter ?
                  data.formatter(value, service) : value
              }</span>
            )
          }

          return <td key={index}>{content}</td>
        })

    return (<tr>{ serviceData }</tr>)
  }
}

ModelRepositoryItem.propTypes = {
  service: PropTypes.object,
  handleCompareStateChange: PropTypes.func
};
export default ModelRepositoryItem;
