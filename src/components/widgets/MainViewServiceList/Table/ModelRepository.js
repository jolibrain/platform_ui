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
      publishError: null
    };

    this.getValue = this.getValue.bind(this);
    this.getBestValue = this.getBestValue.bind(this);
    this.toggleCompareState = this.toggleCompareState.bind(this);

    this.openPublishTrainingModal = this.openPublishTrainingModal.bind(this);
    this.deleteRepositoryModal = this.deleteRepositoryModal.bind(this);
  }

  toggleCompareState() {
    const { service, handleCompareStateChange } = this.props;
    handleCompareStateChange([service.path]);
  }

  openPublishTrainingModal() {
    const { modalStore, service } = this.props;
    modalStore.setVisible("publishTraining", true, {
      service: service
    });
  }

  deleteRepositoryModal() {
    const { modalStore, service } = this.props;
    modalStore.setVisible("deleteRepository", true, {
      service: service
    });
  }

  getValue(service, attr) {
    if (!service.jsonMetrics) return '--';

    const { measure, measure_hist } = service.jsonMetrics.body;

    let value = '--';

    if (measure && measure[attr]) {
      value = measure[attr];
    } else if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value =
        measure_hist[`${attr}_hist`][measure_hist[`${attr}_hist`].length - 1];
    }

    return value;
  }

  getBestValue(service, selector, bestValueCallback) {
    if (!service) return "--";

    const measure_hist = service.jsonMetrics
      ? service.jsonMetrics.body.measure_hist
      : service.measure_hist;

    let value = '--';

    if (
      measure_hist &&
      measure_hist[`${selector}_hist`] &&
      measure_hist[`${selector}_hist`].length > 0
    ) {
      value = bestValueCallback(measure_hist[`${selector}_hist`])
    }

    return value;
  }



  render() {

    const {
      service,
      selectedComparePath
    } = this.props;

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
                onChange={this.toggleCompareState}
                checked={selectedComparePath.includes(service.path)}
              />
            )
          } else if (data.isAction) {

            let publishButton = service.jsonConfig ? (
              <a
                onClick={this.openPublishTrainingModal}
                className="btn btn-outline-secondary"
                title="Publish"
              >
                <i className="fas fa-plus" />
              </a>
            ) : null;

            if (this.state.isPublishing) {
              publishButton = (
                <a className="btn btn-outline-secondary">
                  <i className="fas fa-spinner fa-spin" />
                </a>
              );
            }

            let deleteButton = (
              <a
                onClick={this.deleteRepositoryModal}
                className="btn btn-outline-danger"
                title="Delete"
              >
                <i className="fas fa-trash" />
              </a>
            )

            content = (
              <div>
                <Link
                  to={archiveUrl}
                  type="button"
                  className="btn btn-primary"
                  title="Results"
                >
                  <i className="fas fa-chart-area" />
                </Link>
                {deleteButton}
                {publishButton}
              </div>
            )

          } else if (data.selector) {

            let value = null

            if (data.isValue) {
              value = this.getValue(service, data.selector);
            } else {
              value = service[data.selector] || '--';
            }

            if( value !== '--' ) {
              value = data.formatter ?
                    data.formatter(value, service) : value
            }

            let bestValue = null;

            if (data.bestValueCallback) {
              bestValue = this.getBestValue(
                service,
                data.selector,
                data.bestValueCallback
              );
              bestValue = data.formatter ?
                    data.formatter(bestValue, service) : bestValue;
            }

            content = (
              <>
                { bestValue ? bestValue : value }
              </>
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
